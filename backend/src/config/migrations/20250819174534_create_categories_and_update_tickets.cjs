/**
 * @fileoverview This filecontains the database migration to create a new `ticket_categories` table and update the `tickets` table.
 * It removes old categorie column in the ticket table. And replace it with new ticket_categories table by category_id column (fkey).
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create the new 'ticket_categories' table
  await knex.schema.createTable("ticket_categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE")
      .notNullable();
    table.text("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Ensure a client cannot have duplicate category names
    table.unique(["client_id", "name"]);
  });

  // Add the new 'category_id' column to the 'tickets' table
  await knex.schema.alterTable("tickets", (table) => {
    table
      .uuid("category_id")
      .references("id")
      .inTable("ticket_categories")
      .onDelete("SET NULL");
  });

  // Note: We are not migrating old text-based categories automatically.
  // Remove the old 'category' text column
  await knex.schema.alterTable("tickets", (table) => {
    table.dropColumn("category");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Re-add the old 'category' text column to 'tickets'
  await knex.schema.alterTable("tickets", (table) => {
    table.text("category");
  });

  // Drop the 'category_id' foreign key column from 'tickets'
  await knex.schema.alterTable("tickets", (table) => {
    table.dropColumn("category_id");
  });

  // Drop the 'ticket_categories' table
  await knex.schema.dropTableIfExists("ticket_categories");
};
