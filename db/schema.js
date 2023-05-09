const { gql } = require('apollo-server');
// Schema
const typeDefs = gql`
    type User {
        id: ID
        name: String
        lastname: String
        email: String
        createdOn: String
    }

    type Product {
        id: ID
        name: String
        quantity: Int
        price: Float
        createdOn: String
    }

    type Client {
        id: ID
        name: String
        lastname: String
        email: String
        company: String
        phone: String
        salesman: ID
    }

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: ID
        salesman: ID
        createdOn: String
        state: OrderState
    }

    type OrderGroup {
        id: ID
        quantity: Int
    }

    type Token {
        token: String
    }

    type TopClients {
        total: Float
        client: [Client]
    }

    type TopSalesman {
        total: Float
        salesman: [User]
    }

    input UserInput {
        name: String!
        lastname: String!
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        quantity: Int!
        price: Float!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ClientInput {
        name: String!
        lastname: String!
        company: String!
        email: String!
        phone: String
    }
    
    input OrderProductInput {
        id: ID
        quantity: Int
    }

    enum OrderState {
        PENDING
        COMPLETED
        CANCELLED
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        client: ID
        state: OrderState
    }

    type Query {
        #Users
        getUser(token: String!): User
        
        #Products
        getAllProducts: [Product]
        getProductById(id: ID!): Product
        getProductsByName(name: String!): [Product]
        
        #Clients
        getClients: [Client]
        getClientsVendedor: [Client]
        getClient(id: ID!): Client

        #Orders
        getOrders: [Order]
        getOrderVendedor: [Order]
        getOrder(id: ID!): Order
        getOrderByStatus(state: String!): [Order]

        #AdvancedSearches
        getTopClients: [TopClients]
        getTopSalesman: [TopSalesman]
    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authUser(input: AuthInput): Token
        
        # Products
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput) : Product
        deleteProduct(id: ID!) : String
        
        #Clients
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!): String
        
        #Orders
        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput): Order
        deleteOrder(id: ID!): String
    }
`;

module.exports = typeDefs;