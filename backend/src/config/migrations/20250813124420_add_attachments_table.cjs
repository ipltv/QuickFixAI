/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("attachments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("CASCADE");
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table.text("url");
    table.text("filename");
    table.jsonb("meta");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("ticket_id", "idx_attachments_ticket_id");
    table.index("client_id", "idx_attachments_client_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("attachments");
};
