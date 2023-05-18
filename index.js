const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDb = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';

connectDb();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: 'my-graph-id@my-graph-variant',
            footer: false,
        })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    context: async ({ req }) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const user = await jwt.verify(token.replace('Bearer ', ''), process.env.SECRET)
                return {
                    user
                };
            } catch (error) {
                throw new Error('Invalid token');
            }
        }
    }
});

// start server

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Servidor listo: ${url} - ${process.env.NODE_ENV}`);
})