// migrations/20250819150950_add_ivfflat_indexes_to_embeddings.js

/**
 * @fileoverview This file contains a migration to ivfflat indexes to resolved cases and KB tables.
 * It will use for replacing l2 metric to cosine similarity.
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw("DROP INDEX IF EXISTS idx_resolved_cases_embedding;");
  await knex.raw("DROP INDEX IF EXISTS idx_knowledge_articles_embedding;");

  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resolved_cases_embedding_cos
    ON resolved_cases
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
  `);

  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_articles_embedding_cos
    ON knowledge_articles
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(
    "DROP INDEX CONCURRENTLY IF EXISTS idx_resolved_cases_embedding_cos;"
  );

  await knex.raw(
    "DROP INDEX CONCURRENTLY IF EXISTS idx_knowledge_articles_embedding_cos;"
  );

  await knex.raw(
    "CREATE INDEX idx_resolved_cases_embedding ON resolved_cases USING hnsw (embedding vector_l2_ops);"
  );

  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_articles_embedding
    ON knowledge_articles
    USING hnsw (embedding vector_l2_ops);
  `);
};

// Turn off trx because CONCURRENTLY
exports.config = {
  transaction: false,
};
