/**
 * @fileoverview This file contains a migration to add a column to the 'resolved_cases' table
 * for storing vector embeddings to enable semantic search.
 * An HNSW index is also added for efficient similarity searches. 
 */


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('resolved_cases', (table) => {
    table.specificType('embedding', 'vector(1536)');
  });

  // Add the HNSW index for efficient similarity searches.
  // Knex doesn't have a native HNSW index type, so we use raw SQL.
  await knex.raw('CREATE INDEX idx_resolved_cases_embedding ON resolved_cases USING hnsw (embedding vector_l2_ops);');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop the index first
  await knex.raw('DROP INDEX IF EXISTS idx_resolved_cases_embedding;');

  await knex.schema.alterTable('resolved_cases', (table) => {
    table.dropColumn('embedding');

  });
};