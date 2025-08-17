// models/knowledgeArticleModel.ts

/**
 * @fileoverview This file contains the model for managing knowledge articles.
 * It includes methods intearact with DB for creating, reading, updating, and deleting articles.
 */

import db from "../db/db.js";
import type {
  KnowledgeArticleDB,
  NewKnowledgeArticle,
  SearchResult,
  KnowledgeArticleUpdateData,
} from "../types/types.js";

const TABLE_NAME = "knowledge_articles";

export const knowledgeArticleModel = {
  /**
   * Creates a new knowledge base article.
   * @param articleData - The article data.
   * @returns The created article.
   */
  async create(articleData: NewKnowledgeArticle): Promise<KnowledgeArticleDB> {
    try {
      const [article] = await db<KnowledgeArticleDB>(TABLE_NAME)
        .insert(articleData)
        .returning("*");

      if (!article) {
        // This case is unlikely with returning('*') but good for type safety.
        throw new Error("Article creation failed, no record returned.");
      }
      return article;
    } catch (error) {
      console.error("Error creating knowledge article:", error);
      // Re-throw the error to be handled by the calling service/controller.
      throw error;
    }
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
    try {
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

      // Cast the result because Knex raw queries return `any[]`.
      return results as unknown as SearchResult[];
    } catch (error) {
      console.error("Error during semantic search:", error);
      throw error;
    }
  },

  /**
   * Updates a knowledge base article.
   * @param id - The UUID of the article to update.
   * @param updates - An object with the fields to update.
   * @returns The updated article object, or undefined if not found.
   */
  async update(
    id: string,
    updates: KnowledgeArticleUpdateData
  ): Promise<KnowledgeArticleDB | undefined> {
    try {
      const [updatedArticle] = await db<KnowledgeArticleDB>(TABLE_NAME)
        .where({ id })
        .update(updates)
        .returning("*");

      return updatedArticle;
    } catch (error) {
      console.error(`Error updating article with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a knowledge base article by its ID.
   * @param id - The UUID of the article to delete.
   * @returns The number of deleted rows (1 if successful, 0 if not found).
   */
  async remove(id: string): Promise<number> {
    try {
      return db<KnowledgeArticleDB>(TABLE_NAME).where({ id }).del();
    } catch (error) {
      console.error(`Error deleting article with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finds an article by its UUID.
   * @param id - The UUID of the article.
   * @returns The article object, or undefined if not found.
   */
  async findById(id: string): Promise<KnowledgeArticleDB | undefined> {
    return db<KnowledgeArticleDB>(TABLE_NAME).where({ id }).first();
  },

  /**
   * Finds all articles for a specific client.
   * @param clientId - The client's UUID.
   * @returns An array of articles.
   */
  async findAllByClientId(clientId: string): Promise<KnowledgeArticleDB[]> {
    return db<KnowledgeArticleDB>(TABLE_NAME).where({ client_id: clientId });
  },
};
