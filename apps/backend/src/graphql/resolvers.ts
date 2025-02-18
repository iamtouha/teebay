import type { ApolloServerOptions } from '@apollo/server';
import { createProductSchema, rendProductSchema, updateProductSchema } from 'validator';
import type { AppContext } from './index.js';
import type { Category } from '@prisma/client';

export const resolvers: ApolloServerOptions<AppContext>['resolvers'] = {
  Query: {
    myProducts: (_, __, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      return ctx.db.product.findMany({
        where: { ownerId: ctx.user.id, soldToId: null },
      });
    },
    products: (_, __, ctx) => {
      return ctx.db.product.findMany({
        where: { soldToId: null },
        include: { Owner: true },
      });
    },
    product: (_, arg, ctx) => {
      return ctx.db.product.findUnique({
        where: { id: +arg.id, soldToId: null },
        include: { Owner: true },
      });
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
      return ctx.db.product.delete({ where: { id: +args.id, ownerId: ctx.user.id, soldToId: null } });
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
      const product = await ctx.db.product.findUnique({ where: { id, soldToId: null } });
      if (!product) {
        throw new Error('Product not found');
      }
      const rents = await ctx.db.rent.findMany({
        where: {
          productId: id,
          OR: [
            { rentedAt: { lte: rentedAt }, rentEnd: { gte: rentedAt } },
            { rentedAt: { lte: rentEnd }, rentEnd: { gte: rentEnd } },
            { rentedAt: { gte: rentedAt }, rentEnd: { lte: rentEnd } },
          ],
        },
      });
      if (rents.length) {
        throw new Error('Rent period overlaps with existing rent');
      }
      return ctx.db.rent.create({
        data: { productId: id, rentedAt, rentEnd, userId: ctx.user.id },
      });
    },
  },
};
