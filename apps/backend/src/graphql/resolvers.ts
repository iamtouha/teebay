import type { ApolloServerOptions } from '@apollo/server';
import { createProductSchema } from 'validator';
import type { AppContext } from './index.js';
import type { Category } from '@prisma/client';

export const resolvers: ApolloServerOptions<AppContext>['resolvers'] = {
  Query: {
    myProducts: (_, __, ctx) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      return ctx.db.product.findMany({
        where: { ownerId: ctx.user.id },
      });
    },
    products: (_, __, ctx) => {
      return ctx.db.product.findMany({
        include: { Owner: true },
      });
    },
    product: (_, arg, ctx) => {
      return ctx.db.product.findUnique({
        where: { id: +arg.id },
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
      const product = await ctx.db.product.findUnique({ where: { id: args.id } });
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.ownerId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }

      return ctx.db.product.update({
        where: { id: args.id },
        data: args,
      });
    },
  },
};
