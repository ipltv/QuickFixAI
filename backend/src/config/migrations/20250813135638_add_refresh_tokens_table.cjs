/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("refresh_tokens", (table) => {
    // Primary key using UUID
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // The hashed refresh token. Must be unique.
    table.text("token").notNullable().unique();

    // Foreign key to the users table. Tokens are deleted if the user is deleted.
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();

    // Expiration date for the token.
    table.timestamp("expires_at", { useTz: true }).notNullable();

    // Standard created_at timestamp.
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Index for faster lookups by user_id
    table.index("user_id", "idx_refresh_tokens_user_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("refresh_tokens");
};
