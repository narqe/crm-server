const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDb = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.variables.env' });

connectDb();

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

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// start server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Servidor listo: ${url} - ${process.env.NODE_ENV}`);
})