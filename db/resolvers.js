const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Order = require("../models/Order");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../variables.env' });

const createToken = (user, token, expiresIn) => {
    const { id, email, name, lastname } = user;
    return jwt.sign({ id, email, name, lastname}, token, { expiresIn });
}
// Resolvers
const resolvers = {
    Query: {
        getUser: async (_, {}, ctx) => {
            return ctx.user;
        },
        getAllProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch (error) {
                console.log(error);
            }
        },
        getProductById: async (_, { id }) => {
            try {
                const product = await Product.findById(id);
                if(!product) {
                    throw new Error('ID do not exist')
                }
                return product;
            } catch (error) {
                console.log(error);
            }
        },
        getProductsByName: async (_, { name }) => {
            try {
                const products = await Product.find({'name': {$regex: name} });
                return products;
            } catch (error) {
                console.log(error);
            }
        },
        getClients: async () => {
            try {
                const clients = await Client.find({});
                return clients;
            } catch (error) {
                console.log(error);
            }
        },
        getClientsVendedor: async (_, {}, ctx) => {
            try {
                const clients = await Client.find({ 
                    salesman: ctx.user?.id.toString()
                });
                return clients;
            } catch (error) {
                console.log(error);
            }
        },
        getClient: async (_, { id }, ctx) => {
            const client = await Client.findById(id);
            if (!client) {
                throw new Error('Client does not exist');
            }
            if (client.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied');
            }
            return client;
        },
        getOrders: async () => {
            try {
                const orders = await Order.find({});
                return orders;
            } catch (error) {
                console.log(error);
            }
        },
        getOrderVendedor: async (_, {}, ctx) => {
            try {
                const orders = await Order.find({ 
                    salesman: ctx.user.id.toString()
                }).populate('client');
                return orders;
            } catch (error) {
                console.log(error);
            }
        },
        getOrder:  async (_, { id }, ctx) => {
            const order = await Order.findById(id);
            if (!order) {
                throw new Error('Order does not exist');
            }
            if (order.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied');
            }
            return order;
        },
        getOrderByStatus: async (_, { state }, ctx) => {
            const order = await Order.find({ salesman: ctx.user.id, state })
            return order;
        },
        getTopClients: async () => {
            const clients = await Order.aggregate([
                { $match: { state: "COMPLETED" } },
                { $group: {
                    _id: "$client",
                    total: { $sum: "$total" }
                }},
                {   $lookup: {
                        from: 'clients',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'client'
                    }
                },
                { 
                    $limit: 10
                },
                {
                    $sort: { total: - 1 }
                }
            ]);
            
            return clients;
        },
        getTopSalesman: async () => {
            const salesman = await Order.aggregate([
                { $match: { state: "COMPLETED" } },
                { $group: {
                    _id: "$salesman",
                    total: { $sum: "$total" }
                }},
                { $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'salesman'
                    }
                },
                { 
                    $limit: 3
                },
                {
                    $sort: { total: - 1 }
                },
            ]);
            
            return salesman;
        }
    },
    Mutation: {
        newUser: async (_, { input }) => {
            const { email, password } = input;
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            const userExist = await User.findOne({ email });
            if (userExist) {
                throw new Error ('User email already exist on DB')
            }

            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                
            }
        },
        authUser: async(_, { input }) => {
            const { email, password } = input;
            const isUserExit = await User.findOne({ email });

            if (!isUserExit) {
                throw new Error ('User is not exists');
            }

            const passwordIsOk = await bcryptjs.compare(password, isUserExit.password)

            if (!passwordIsOk) {
                throw new Error('Password is wrong')
            }

            return {
                token: createToken(isUserExit, process.env.SECRET, '24h')
            }


        },
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);
                const newProduct = await product.save()
                return newProduct;
            } catch (error) {
                console.log(error);
            }
        },
        updateProduct: async (_, { id, input }) => {
            let product = await Product.findById(id);
            
            if(!product) {
                throw new Error('ID do not exist')
            }

            product = await Product.findOneAndUpdate(
                { _id: id }, 
                input, 
                { new: true }
            )

            return product;
        },
        deleteProduct: async (_, { id }) => {
            let product = await Product.findById(id);
            
            if(!product) {
                throw new Error('Product do not exist')
            }
            await Product.findOneAndDelete({ _id: id });

            return `${product.id} was deleted`
        },
        newClient: async (_, { input }, ctx) => {
            const { email } = input
            const client = await Client.findOne({ email });

            if (client) {
                throw new Error('Client already exists')
            }
            const newClient = new Client(input);
            newClient.salesman = ctx.user.id

            try {
                const result = await newClient.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateClient: async (_, {id, input }, ctx) => {
            let client = await Client.findById(id);
            if(!client) {
                throw new Error('Client does not exist');
            }
            if (client.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied');
            }

            client = await Client.findOneAndUpdate({_id: id }, input, { new: true })
            return client;
        },
        deleteClient: async (_, { id }, ctx) => {
            let client = await Client.findById(id);
            
            if(!client) {
                throw new Error('Client do not exist')
            }
            if (client.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied');
            }
            await Client.findOneAndDelete({ _id: id });

            return `${client.email} was deleted`
        },
        newOrder: async (_, { input }, ctx) => {
            const { client } = input;
            let isClientExist = await Client.findById(client);
            if (!isClientExist) {
                throw new Error('Client does not exist')
            }
            if (isClientExist.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied');
            }

            if (input.order) {
                for await (const article of input.order) {
                    const { id, quantity } = article;
                    const product = await Product.findById(id);

                    if (quantity === 0 || quantity > product.quantity) {
                        throw new Error(`Acticle ${product.name} is not available for the quantity you order`)
                    } else {
                        product.quantity = product.quantity - quantity;

                        await product.save();
                    }
                }
            }

            const newOrder = new Order(input);
            newOrder.salesman = ctx.user.id

            try {
                const result = await newOrder.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateOrder: async(_, { id, input }, ctx) => {
            const { client } = input;

            const isOrderExist = await Order.findById(id);
            if(!isOrderExist) {
                throw new Error('Order do not exist')
            }

            const isClientExist = await Client.findById(client);
            if(!isClientExist) {
                throw new Error('Client does not exist')
            }

            if(isClientExist.salesman.toString() !== ctx.user.id) {
                throw new Error('Access denied')
            }

            if (input.order) {
                for await (const article of input.order) {
                    const { id, quantity } = article;

                    const product = await Product.findById(id);
    
                    if (quantity === 0 || quantity > product.quantity) {
                        throw new Error(`Acticle ${product.name} is not available for the quantity you order`)
                    } else {
                        product.quantity = product.quantity - quantity;
    
                        await product.save();
                    }
                }
            }

            const result = await Order.findOneAndUpdate({ _id: id }, input, { new: true })
            return result;
        },
        deleteOrder: async(_, { id }, ctx) => {
            const order = await Order.findById(id);
            
            if (!order) {
                throw new Error('Order does not exist')
            }
            if (order.salesman.toString() !== ctx.user.id) {
                throw new Error('Access Denied')
            }

            await Order.findByIdAndDelete({_id: id});
            return `Order ${id} deleted`
        }
    }
}

module.exports = resolvers;