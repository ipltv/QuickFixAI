/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("ai_responses", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("CASCADE");
    table.uuid("user_id").references("id").inTable("users");
    table.text("model");
    table.text("prompt");
    table.text("response");
    table.integer("tokens_used");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("ticket_id", "idx_ai_responses_ticket_id");
    table.index("user_id", "idx_ai_responses_user_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("ai_responses");
};
