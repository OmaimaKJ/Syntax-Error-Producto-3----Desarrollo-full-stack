const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Esquema GraphQL de prueba
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Resolver de prueba
const root = {
  hello: () => {
    return '¡Hola desde GraphQL!';
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Interfaz web para probar GraphQL
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
});
