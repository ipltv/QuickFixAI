/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("equipment", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table.text("name").notNullable();
    table.text("type");
    table.jsonb("meta").defaultTo("{}");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Index
    table.index("client_id", "idx_equipment_client_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("equipment");
};
