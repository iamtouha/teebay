import type { ApolloServerOptions } from '@apollo/server';
import { createProductSchema, rendProductSchema, updateProductSchema } from 'validator';
import type { AppContext } from './index.js';
import type { Category } from '@prisma/client';
import { isBefore, isValid, startOfDay } from 'date-fns';
import { convertDateColumns } from '../utils/functions.js';

export const resolvers: ApolloServerOptions<AppContext>['resolvers'] = {
  Query: {
    myProducts: async (_, __, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const data = await ctx.db.product.findMany({
        where: {
          OR: [
            { ownerId: ctx.user.id },
            { soldToId: ctx.user.id },
            { Rent: { some: { userId: ctx.user.id, rentEnd: { gte: new Date() } } } },
          ],
        },
        include: { Rent: { where: { rentEnd: { gte: new Date() } } } },
      });
      return data.map((p) => convertDateColumns(p));
    },
    products: async (_, __, ctx) => {
      const data = await ctx.db.product.findMany({
        where: { soldToId: null },
        include: { Owner: true },
      });
      return data.map((p) => convertDateColumns(p));
    },
    product: async (_, arg, ctx) => {
      const data = await ctx.db.product.findUnique({
        where: { id: +arg.id, soldToId: null },
        include: { Owner: true },
      });
      return data;
    },
    profile: async (_, __, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      return ctx.user;
    },
  },
  Mutation: {
    createProduct: async (_, args, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const validated = createProductSchema.safeParse(args.input);
      if (!validated.success) {
        console.log(validated.error.flatten());
        throw new Error('Invalid input');
      }

      return ctx.db.product.create({
        data: {
          ...validated.data,
          categories: validated.data.categories as Category[],
          ownerId: ctx.user.id,
        },
      });
    },
    updateProduct: async (_, args, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const validated = updateProductSchema.safeParse(args.input);
      if (!validated.success) {
        throw new Error(JSON.stringify(validated.error.flatten()));
      }
      const { id, ...data } = validated.data;
      const product = await ctx.db.product.findUnique({ where: { id, soldToId: null, ownerId: ctx.user.id } });
      if (!product) {
        throw new Error('Product not found');
      }

      return ctx.db.product.update({ where: { id }, data });
    },
    deleteProduct: async (_, args, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const productId = +args.id;
      const product = await ctx.db.product.findUnique({ where: { id: productId, ownerId: ctx.user.id } });
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.soldToId) {
        throw new Error('Product is already sold');
      }
      const rents = await ctx.db.rent.findFirst({ where: { productId, rentEnd: { gte: new Date() } } });
      if (rents) {
        throw new Error('Product is currently rented');
      }
      return ctx.db.product.delete({ where: { id: productId } });
    },
    buyProduct: async (_, args, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const product = await ctx.db.product.findUnique({
        where: {
          id: +args.id,
          soldToId: null,
        },
      });
      if (!product) {
        throw new Error('Product not found');
      }
      const hasRented = await ctx.db.rent.findFirst({
        where: { productId: +args.id, rentEnd: { gte: new Date() } },
      });
      if (hasRented) {
        throw new Error('Product is currently rented');
      }
      if (product.ownerId === ctx.user.id) {
        throw new Error('Cannot buy own product');
      }
      return ctx.db.product.update({
        where: { id: +args.id },
        data: { soldToId: ctx.user.id, soldAt: new Date() },
      });
    },
    rentProduct: async (_, args, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const data = rendProductSchema.safeParse(args.input);
      if (!data.success) {
        throw new Error(JSON.stringify(data.error.flatten()));
      }
      const { id, rentedAt, rentEnd } = data.data;
      const startDate = new Date(rentedAt);
      const endDate = new Date(rentEnd);

      if (!(isValid(startDate) && isValid(endDate))) {
        throw new Error('Invalid date');
      }

      // Validate rent period
      if (isBefore(startOfDay(rentedAt), startOfDay(new Date()))) {
        throw new Error('Date must not be in the past');
      }
      if (isBefore(endDate, startDate)) {
        throw new Error('Invalid rent end date');
      }

      const product = await ctx.db.product.findUnique({ where: { id, soldToId: null } });
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.ownerId === ctx.user.id) {
        throw new Error('Cannot rent own product');
      }

      const rents = await ctx.db.rent.findMany({
        where: {
          productId: id,
          OR: [
            // Check if rent period overlaps with existing rents
            { rentedAt: { lte: startDate }, rentEnd: { gte: startDate } },
            { rentedAt: { lte: endDate }, rentEnd: { gte: endDate } },
            { rentedAt: { gte: startDate }, rentEnd: { lte: endDate } },
          ],
        },
      });
      if (rents.length) {
        throw new Error('Rent period overlaps with existing rent');
      }
      return ctx.db.rent.create({
        data: { productId: id, rentedAt: startDate, rentEnd: endDate, userId: ctx.user.id },
      });
    },
  },
};
