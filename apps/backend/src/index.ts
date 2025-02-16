import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import { type AppContext, typeDefs, resolvers } from './graphql/index.js';
import authRouter from './auth.js';
import { authMiddleware } from './utils/jwt.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { prisma } from './db.js';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await apolloServer.start();

app.use(cors<cors.CorsRequest>());
app.use(express.json());

app.use(authMiddleware);

app.use('/api/auth', authRouter);
app.use(
  '/graphql',
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const user = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
      return { user, db: prisma };
    },
  })
);

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
