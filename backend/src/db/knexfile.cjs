// db/knexfile.cjs
/**
 * @fileoverview Knex.js configuration file.
 * This file defines the database connection settings and migration/seed directories
 * for different application environments (development, production, test).
 * The active configuration is determined by the `NODE_ENV` environment variable,
 * with a fallback to the `development` configuration if `NODE_ENV` is not set.
 */

console.log("Knexfile is being executed");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || "development";
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const config = {
  /**
   * Development environment configuration.
   * - Uses the `pg` client for PostgreSQL.
   * - Connects to the database using the `DATABASE_URL` environment variable.
   * - Migration files are located in `../config/migrations`.
   * - Seed files are located in `../config/seeds`.
   */
  development: {
    client: "pg",
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "../config/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "../config/seeds"),
    },
  },
  /**
   * Production environment configuration.
   * - Similar to development but includes a connection pool for better performance
   * under heavy load.
   * - The pool is configured to have a minimum of 2 and a maximum of 10 connections.
   */
  production: {
    client: "pg",
    connection: DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "../config/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "../config/seeds"),
    },
  },
  /**
   * Test environment configuration.
   * - Identical to the development setup for testing purposes.
   */
  test: {
    client: "pg",
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "../config/migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.join(__dirname, "../config/seeds"),
    },
  },
};

module.exports = config[NODE_ENV] || config.development;
