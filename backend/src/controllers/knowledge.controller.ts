/**
 * @fileoverview This file contains the controller for managing knowledge articles.
 * It includes methods for creating, reading, updating, and deleting articles.
 * It also handles authorization based on user roles.
 * The controller interacts with the knowledgeArticleModel for database operations.
 */

import type { Request, Response } from "express";
import { knowledgeArticleModel } from "../model/knowledgeArticleModel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors.js";
import {
  type NewKnowledgeArticle,
  type KnowledgeArticleUpdateData,
  type JwtPayload,
  ROLES,
} from "../types/types.js";

// Placeholder function to simulate embedding generation.
// TODO: Replace with actual embedding service integration from OpenAI.
const getEmbeddingFromString = async (text: string): Promise<number[]> => {
  console.log(`Generating embedding for text: "${text.substring(0, 30)}..."`);
  // The dimension (1536) must match database schema.
  return Array.from({ length: 1536 }, () => Math.random());
};

export const knowledgeController = {
  /**
   * @description Creates a new knowledge article.
   */
  async createArticle(req: Request, res: Response): Promise<Response> {
    const { title, content, tags } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!title || !content) {
      throw new BadRequestError("Title and content are required.");
    }

    // A client_admin and support can only create articles for their own client.
    // A system_admin must specify the client_id in the request body.
    let clientId = req.body.client_id;
    if (
      currentUser.role === ROLES.CLIENT_ADMIN ||
      currentUser.role === ROLES.SUPPORT
    ) {
      clientId = currentUser.clientId;
    } else if (currentUser.role === ROLES.SYSTEM_ADMIN && !clientId) {
      throw new BadRequestError("client_id is required for system_admin.");
    }

    const embedding = await getEmbeddingFromString(`${title}\n${content}`);

    const newArticle: NewKnowledgeArticle = {
      client_id: clientId,
      title,
      content,
      tags: tags || [],
      embedding,
    };

    const createdArticle = await knowledgeArticleModel.create(newArticle);
    return res.status(201).json(createdArticle);
  },

  /**
   * @description Gets all articles for the user's client.
   */
  async getArticles(req: Request, res: Response): Promise<Response> {
    const currentUser = req.user as JwtPayload;
    const articles = await knowledgeArticleModel.findAllByClientId(
      currentUser.clientId
    );
    return res.status(200).json(articles);
  },

  /**
   * @description Gets a single article by ID.
   */
  async getArticleById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;
    // Validate input
    if (!id) {
      throw new BadRequestError("Article ID is required.");
    }

    const article = await knowledgeArticleModel.findById(id);
    if (!article) {
      throw new NotFoundError("Knowledge article not found.");
    }

    // Authorization: Ensure user can only access articles from their own client.
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      article.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this article."
      );
    }

    return res.status(200).json(article);
  },

  /**
   * @description Updates an existing knowledge article.
   */
  async updateArticle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const currentUser = req.user as JwtPayload;

    // Validate input
    if (!id) {
      throw new BadRequestError("Article ID is required.");
    }
    if (!title && !content && !tags) {
      throw new BadRequestError(
        "At least one field (title, content, tags) is required."
      );
    }

    // Fetch the existing article to check permissions
    const article = await knowledgeArticleModel.findById(id);
    if (!article) {
      throw new NotFoundError("Knowledge article not found.");
    }

    // Authorization: Ensure user can only update articles from their own client.
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      article.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to modify this article."
      );
    }

    const updateData: KnowledgeArticleUpdateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;

    // If content changes, a new embedding must be generated.
    if (content) {
      const newEmbeddingText = `${title || article.title}\n${content}`;
      updateData.embedding = await getEmbeddingFromString(newEmbeddingText);
    }

    const updatedArticle = await knowledgeArticleModel.update(id, updateData);
    return res.status(200).json(updatedArticle);
  },

  /**
   * @description Deletes a knowledge article.
   */
  async deleteArticle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;
    // Validate input
    if (!id) {
      throw new BadRequestError("Article ID is required.");
    }

    const article = await knowledgeArticleModel.findById(id);
    if (!article) {
      throw new NotFoundError("Knowledge article not found.");
    }

    // Authorization: Ensure user can only delete articles from their own client.
    if (
      currentUser.role !== "system_admin" &&
      article.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to delete this article."
      );
    }

    await knowledgeArticleModel.remove(id);
    return res.sendStatus(204);
  },

  /**
   * @description Performs a semantic search for articles.
   */
  async searchArticles(req: Request, res: Response): Promise<Response> {
    const { query } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!query) {
      throw new BadRequestError("Search query is required.");
    }

    const embedding = await getEmbeddingFromString(query);
    const results = await knowledgeArticleModel.semanticSearch(
      currentUser.clientId,
      embedding
    );

    return res.status(200).json(results);
  },
};
