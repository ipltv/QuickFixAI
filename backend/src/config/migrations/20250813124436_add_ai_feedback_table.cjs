/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("ai_feedback", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("ai_response_id")
      .references("id")
      .inTable("ai_responses")
      .onDelete("CASCADE");
    table
      .uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.integer("rating").notNullable();
    table.text("comment");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Constraint
    table.check("rating BETWEEN 1 AND 5", {}, "rating_check");

    // Indexes
    table.index("ai_response_id", "idx_ai_feedback_ai_response_id");
    table.index("ticket_id", "idx_ai_feedback_ticket_id");
    table.index("user_id", "idx_ai_feedback_user_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("ai_feedback");
};
