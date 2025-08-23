const bcrypt = require("bcrypt");

// Load environment variables
require("dotenv").config({ path: "../../.env" });

const SALT_ROUNDS = 10;
const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Check if the admin user already exists
  const adminExists = await knex("users").where({ email: ADMIN_EMAIL }).first();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log(
      "Skipping admin seed: INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD not set in .env"
    );
    return;
  }

  if (!adminExists) {
    console.log(`Creating system admin user: ${ADMIN_EMAIL}`);

    // Hash the password
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // Insert the new system admin user
    await knex("users").insert({
      email: ADMIN_EMAIL,
      password_hash: password_hash,
      role: "system_admin",
      name: "System Administrator",
      // This user won't be associated with a specific client
      client_id: null,
    });
  } else {
    console.log(`Admin user ${ADMIN_EMAIL} already exists. Skipping.`);
  }
};
