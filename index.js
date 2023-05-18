const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDb = require('./config/db');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config({ path: '.variables.env' });
const cors = require('cors');

connectDb();

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
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

server.re

// start server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Servidor listo: ${url} - ${process.env.NODE_ENV}`);
})

app.use(
    '/graphql',
    cors<cors.CorsRequest>({ 
        origin: [
            'https://crmclient-narqe.vercel.app/', 
            'https://agile-meadow-64078.herokuapp.com/', 
            'https://studio.apollographql.com'
        ] 
    }),
);