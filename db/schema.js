const { gql } = require('apollo-server-express');

// Schema
const typeDefs = gql`
    type Blog {
        id: ID
        title: String
        author: String
        content: String
        summary: String
        createdOn: String
        category: [CatInput]
        isFeatured: Boolean
    }

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
        client: Client
        salesman: ID
        createdOn: String
        state: OrderState
    }

    type OrderGroup {
        id: ID
        quantity: Int
        name: String
        price: Float
    }

    type Token {
        token: String
    }

    type FileUploaded {
        url: String
    }

    type TopClients {
        total: Float
        client: [Client]
    }

    type TopSalesman {
        total: Float
        salesman: [User]
    }


    type Categories {
        title: CatInput
        id: ID
    }

    input BlogInput {
        title: String!
        content: String!
        summary: String!
        author: String
        category: [CatInput]!
        isFeatured: Boolean!
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
        name: String
        price: Float
    }

    enum OrderState {
        PENDING
        COMPLETED
        CANCELLED
    }

    enum CatInput {
        MUSIC
        GAMES
        SERIES
        CINEMA
        EVENTS
        BOOKS
        OTHER
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        client: ID
        state: OrderState
    }

    input FileInput {
        name: String!
        type: String!
        size: Int!
    }
    
    type Query {
        #Users
        getUser: User
        
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

        #Blogs
        getBlogs: [Blog]
        getBlogById(id: ID!): Blog
        getLastBlogsByCat(cat: CatInput, limit: Int): [Blog]
        getBlogCategories: [Categories]
        getFeaturedPosts(limit: Int): [Blog]
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

        #Blogs
        newBlog(input: BlogInput): Blog
        updateBlog(id: ID!, input: BlogInput): Blog
        deleteBlog(id: ID!): String

        #Files
        uploadFile(input: FileInput): FileUploaded!
    }
`;

module.exports = typeDefs;