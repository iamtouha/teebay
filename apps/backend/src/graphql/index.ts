import { ApolloServer } from '@apollo/server';
import http from 'http';
import { typeDefs } from './typeDef.js';
import { resolvers } from './resolvers.js';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import type { User, PrismaClient } from '@prisma/client';
import { expressMiddleware } from '@apollo/server/express4';
import { prisma } from '../db.js';

export type AppContext = {
  user: User | null;
  db: PrismaClient;
};

export const initApolloServer = async (httpServer: http.Server) => {
  const server = new ApolloServer<AppContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  return expressMiddleware(server, {
    context: async ({ req }) => {
      const user = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
      return { user, db: prisma };
    },
  });
};
