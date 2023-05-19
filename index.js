const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDb = require('./config/db');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config({ path: '.variables.env' });

connectDb();

async function startApolloServer() {
    const app = express();
    
    app.use(cors());
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    const server = new ApolloServer({
        cache: "bounded",
        persistedQueries: false,
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

    await server.start();

    server.applyMiddleware({ app });

    // start server
    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`Servidor listo en: ${process.env.PORT} - ${process.env.NODE_ENV}`);
    })
}

startApolloServer().catch((err) => {
    console.error(err);
});