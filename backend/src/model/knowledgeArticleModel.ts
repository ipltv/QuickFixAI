// models/knowledgeArticleModel.ts
import db from "../db/db.js";
import type {
  KnowledgeArticleDB,
  NewKnowledgeArticle,
  SearchResult,
} from "../types/types.js";

const TABLE_NAME = "knowledge_articles";

export const knowledgeArticleModel = {
  /**
   * Creates a new knowledge base article.
   * @param articleData - The article data.
   * @returns The created article.
   */
  async create(articleData: NewKnowledgeArticle): Promise<KnowledgeArticleDB> {
    const [article] = await db<KnowledgeArticleDB>(TABLE_NAME)
      .insert(articleData)
      .returning([
        "id",
        "client_id",
        "title",
        "content",
        "tags",
        "embedding",
        "created_at",
      ]);
    return article as KnowledgeArticleDB;
  },

  /**
   * Performs a semantic search using vector embeddings.
   * @param clientId - The client's UUID to scope the search.
   * @param embedding - The search vector.
   * @param limit - The max number of results to return.
   * @returns Found articles with a 'distance' score.
   */
  async semanticSearch(
    clientId: string,
    embedding: number[],
    limit = 5
  ): Promise<SearchResult[]> {
    const embeddingString = `[${embedding.join(",")}]`;

    // Use knex.raw for the custom pgvector operator.
    const results = await db<KnowledgeArticleDB>(TABLE_NAME)
      .select(
        "id",
        "title",
        "content",
        "tags",
        db.raw("embedding <-> ? as distance", [embeddingString])
      )
      .where("client_id", clientId)
      .orderBy("distance", "asc")
      .limit(limit);

    // We cast the result because Knex raw queries return `any[]`.
    return results as unknown as SearchResult[];
  },
};
