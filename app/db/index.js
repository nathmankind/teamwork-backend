const { Client } = require("pg");

const dotenv = require("dotenv");

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL_LOCAL;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

client.connect();

module.exports = client;
