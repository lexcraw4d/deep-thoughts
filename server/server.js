const express = require('express');
const { authMiddleware } = require('./utils/auth');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
let server = null;
async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        context: authMiddleware 
    });
    await server.start();
    server.applyMiddleware({ app });
}
startServer()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
