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
} from "../types/index.js";
import toVectorString from "../helpers/toVectorString.js";
import { semanticSearchBase } from "../helpers/semanticSearch.js";

const TABLE_NAME = "knowledge_articles";

export const knowledgeArticleModel = {
  /**
   * Creates a new knowledge base article.
   * @param articleData - The article data.
   * @returns The created article.
   */
  async create(articleData: NewKnowledgeArticle): Promise<KnowledgeArticleDB> {
    try {
      const dataToInsert: NewKnowledgeArticle = {
        ...articleData,
        embedding: toVectorString(articleData.embedding) as any,
      };

      const [article] = await db<KnowledgeArticleDB>(TABLE_NAME)
        .insert(dataToInsert)
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
      // Create a mutable copy of the updates with a flexible type.
      const dataToUpdate: { [key: string]: any } = { ...updates };

      // If the embedding is part of the update, it also needs to be formatted.
      if (updates.embedding) {
        dataToUpdate.embedding = toVectorString(updates.embedding);
      }

      const [updatedArticle] = await db<KnowledgeArticleDB>(TABLE_NAME)
        .where({ id })
        .update(dataToUpdate)
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
      return semanticSearchBase(
        TABLE_NAME,
        clientId,
        embedding,
        ["title", "content", "tags"],
        limit
      );
    } catch (error) {
      console.log(
        `Error performing semantic search for articles for client ID ${clientId}:`,
        error
      );
      throw error;
    }
  },
};
