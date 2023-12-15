const dotenv = require("dotenv");
const pgp = require("pg-promise")(); // Importa "pgp" ma non chiama la funzione subito

dotenv.config();

const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(cn); // Chiama la funzione "pgp" con le tue informazioni di connessione

module.exports = db;
