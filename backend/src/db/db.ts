// db/db.ts

/**
 * @fileoverview Database connection setup using Knex.js.
 * This file initializes a Knex instance with the configuration defined in knexfile.cjs.
 * It exports the initialized Knex instance for use in other parts of the application.
 */

import knex from "knex";
import { createRequire } from "module";
import type { Knex } from "knex";

// import config from "./knexfile.cjs";
/**
 * Initializes a Knex instance with the configuration from knexfile.cjs.
 * The configuration is determined by the `NODE_ENV` environment variable,
 * defaulting to 'development' if not set.
 *
 * @returns {Knex} - The initialized Knex instance.
 */

const require = createRequire(import.meta.url);
const config: Knex.Config = require("./knexfile.cjs");
const db = knex(config);

export default db;
