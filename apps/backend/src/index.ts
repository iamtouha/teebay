import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { initApolloServer } from './graphql/index.js';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = initApolloServer(httpServer);
await apolloServer.start();

app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer));

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
