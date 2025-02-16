import { type ApolloServerOptions } from '@apollo/server';
import type { User, PrismaClient, Category } from '@prisma/client';

export type AppContext = {
  user: User | null;
  db: PrismaClient;
};

import { createProductSchema } from 'validator';

export const typeDefs = `#graphql
enum Category {
  ELECTRONICS
  FURNITURE
  HOME_APPLIANCES
  SPORTING_GOODS
  OUTDOOR
  TOYS
}

type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  phone: String
  address: String
}

type Product {
  id: ID!
  name: String!
  description: String!
  price: Float!
  rent: Float!
  Owner: User!
  category: Category!
  isRented: Boolean!
  rentEndDate: String
  createdAt: String!
  updatedAt: String!
}

type ProductWithOwner {
  id: ID!
  name: String!
  description: String!
  price: Float!
  rent: Float!
  Owner: User!
  category: Category!
  isRented: Boolean!
  rentEndDate: String
  createdAt: String!
  updatedAt: String!
}

input NewProductInput {
  name: String!
  description: String!
  category: Category!
  price: Float!
  rent: Float!
}

input UpdateProductInput {
  id: ID!
  name: String
  description: String
  category: Category
  price: Float
  rent: Float
  isRented: Boolean
  rentEndDate: String
}

type Mutation {
  createProduct(input: NewProductInput!): Product!
  updateProduct(input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Product!
}

type Query { 
  products: [ProductWithOwner!]!
  product(id: ID!): Product
}
`;

export const resolvers: ApolloServerOptions<AppContext>['resolvers'] = {
  Query: {
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
          category: validated.data.category as Category,
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
