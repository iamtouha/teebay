import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import { initApolloServer, type AppContext } from './graphql/index.js';
import authRouter from './auth.js';
import { authMiddleware } from './utils/jwt.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { prisma } from './db.js';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = await initApolloServer(httpServer);

app.use(cors<cors.CorsRequest>());
app.use(express.json());

app.use(authMiddleware);

app.use('/api/auth', authRouter);
app.use('/graphql', apolloServer);

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
