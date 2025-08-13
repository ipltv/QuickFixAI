/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("knowledge_articles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table.text("title");
    table.text("content");
    table.specificType("tags", "TEXT[]");
    table.specificType("embedding", "vector(1536)"); // pgvector type
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    // Indexes
    table.index("client_id", "idx_knowledge_articles_client_id");
  });

  // HNSW index for vector semantic search
  await knex.raw(
    "CREATE INDEX idx_knowledge_articles_embedding ON knowledge_articles USING hnsw (embedding vector_l2_ops)"
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("knowledge_articles");
};
