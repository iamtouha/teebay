import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { initApolloServer } from './graphql/index.js';
import authRouter from './auth.js';
import { authMiddleware } from './utils/jwt.js';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = initApolloServer(httpServer);
await apolloServer.start();

app.use(cors<cors.CorsRequest>());
app.use(express.json());

app.use(authMiddleware);

app.use('/api/auth', authRouter);
app.use('/graphql', expressMiddleware(apolloServer));

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
