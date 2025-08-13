/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("resolved_cases", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table
      .uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("SET NULL");
    table.text("title");
    table.text("problem_description");
    table.text("ai_response");
    table.specificType("tags", "TEXT[]");
    table.text("source").defaultTo("feedback");
    table
      .uuid("created_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("client_id", "idx_resolved_cases_client_id");
    table.index("created_by", "idx_resolved_cases_created_by");
    table.index("tags", "idx_resolved_cases_tags", "gin");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("resolved_cases");
};
