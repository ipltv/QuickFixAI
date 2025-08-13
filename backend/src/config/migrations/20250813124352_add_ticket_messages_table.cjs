/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("ticket_messages", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("CASCADE");
    table.uuid("author_id").references("id").inTable("users");
    table.text("author_type"); // 'user'|'ai'|'support'
    table.text("content");
    table.jsonb("meta").defaultTo("{}");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("ticket_id", "idx_ticket_messages_ticket_id");
    table.index("author_id", "idx_ticket_messages_author_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("ticket_messages");
};
