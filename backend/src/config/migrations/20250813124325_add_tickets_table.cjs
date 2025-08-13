/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("tickets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table.uuid("created_by").references("id").inTable("users");
    table.text("category");
    table.text("status").defaultTo("open");
    table.integer("priority").defaultTo(3);
    table.text("subject");
    table.text("description");
    table.uuid("equipment_id").references("id").inTable("equipment").nullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("client_id", "idx_tickets_client_id");
    table.index("created_by", "idx_tickets_created_by");
    table.index("equipment_id", "idx_tickets_equipment_id");
    table.index(["client_id", "status"], "idx_tickets_client_status");
    table.index("created_at", "idx_tickets_created_at", {
      storageEngineIndexType: "btree",
      indexType: "DESC",
    });
    table.index("updated_at", "idx_tickets_updated_at", {
      storageEngineIndexType: "btree",
      indexType: "DESC",
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("tickets");
};
