// index.js

// ---------------------
// IMPORTACIONES BÁSICAS
// ---------------------
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors'); // Para evitar problemas CORS

// -----------------------------
// IMPORTAMOS LOS MODELOS (MEMORIA)
// -----------------------------
const Usuario = require('./mvc/modelo/Usuario');
const Voluntariado = require('./mvc/modelo/Voluntariado');

// Estructuras de memoria para simular la persistencia
const usuarios = [];
const voluntariados = [];

// -----------------------------
// DEFINIMOS EL ESQUEMA GRAPHQL
// -----------------------------
const schema = buildSchema(`

  # Tipos de datos
  type Usuario {
    nombre: String
    correo: String
    password: String
  }

  type Voluntariado {
    id: ID
    titulo: String
    usuario: String
    fecha: String
    descripcion: String
    tipo: String
  }

  # Consultas
  type Query {
    obtenerUsuarios: [Usuario]
    obtenerVoluntariados: [Voluntariado]
  }

  # Mutaciones
  type Mutation {
    crearUsuario(nombre: String!, correo: String!, password: String!): Usuario
    eliminarUsuario(correo: String!): Boolean

    crearVoluntariado(id: ID!, titulo: String!, usuario: String!, fecha: String!, descripcion: String!, tipo: String!): Voluntariado
    eliminarVoluntariado(id: ID!): Boolean
  }
`);

// -----------------------------
// DEFINIMOS LOS RESOLVERS
// -----------------------------
const root = {
  // ----------- USUARIOS -----------
  obtenerUsuarios: () => usuarios,

  crearUsuario: ({ nombre, correo, password }) => {
    if (usuarios.find(u => u.correo === correo)) {
      throw new Error("Correo ya registrado");
    }
    const nuevo = new Usuario(nombre, correo, password);
    usuarios.push(nuevo);
    return nuevo;
  },

  eliminarUsuario: ({ correo }) => {
    const index = usuarios.findIndex(u => u.correo === correo);
    if (index === -1) return false;
    usuarios.splice(index, 1);
    return true;
  },

  // ----------- VOLUNTARIADOS -----------
  obtenerVoluntariados: () => voluntariados,

  crearVoluntariado: ({ id, titulo, usuario, fecha, descripcion, tipo }) => {
    const nuevo = new Voluntariado(id, titulo, usuario, fecha, descripcion, tipo);
    voluntariados.push(nuevo);
    return nuevo;
  },

  eliminarVoluntariado: ({ id }) => {
    const index = voluntariados.findIndex(v => v.id == id);
    if (index === -1) return false;
    voluntariados.splice(index, 1);
    return true;
  }
};

// -----------------------------
// CONFIGURACIÓN DEL SERVIDOR
// -----------------------------
const app = express();
app.use(cors()); // Para permitir llamadas desde Postman o frontend

// Ruta /graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Interfaz web para pruebas
}));

// Lanzar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/graphql`);
});
