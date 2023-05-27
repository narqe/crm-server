const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDb = require('./config/db');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
require('dotenv').config({ path: 'variables.env' });

connectDb();

aws.config.loadFromPath('./aws-config.json');

const server = new ApolloServer({
    uploads: true,
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

// start server
let port = process.env.PORT || 4000;

server.listen(port).then(({ url }) => {
    console.log(`Servidor listo en: ${url}`);
})


