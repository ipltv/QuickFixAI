/**
 * @fileoverview This file contains the controller for managing ticket categories.
 * It includes methods for creating, reading, updating, and deleting categories.
 * It also handles authorization based on user roles.
 */

import type { Request, Response } from "express";
import { categoryModel } from "../model/categoryModel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors.js";
import type {
  NewCategory,
  CategoryUpdateData,
  JwtPayload,
} from "../types/index.js";
import { ROLES } from "../types/index.js";

export const categoryController = {
  /**
   * @description Creates a new ticket category.
   * @route POST api/categories/
   */
  async createCategory(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!name) {
      throw new BadRequestError("Category name is required.");
    }

    let client_id = req.body.client_id;
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      client_id = currentUser.clientId;
    } else if (currentUser.role === ROLES.SYSTEM_ADMIN && !client_id) {
      throw new BadRequestError("client_id is required for system_admin.");
    }

    const newCategoryData: NewCategory = { client_id, name };
    const category = await categoryModel.create(newCategoryData);
    return res.status(201).json(category);
  },

  /**
   * @description Gets all categories for the user's client.
   * @route GET api/categories/
   */
  async getCategories(req: Request, res: Response): Promise<Response> {
    const currentUser = req.user as JwtPayload;
    const categories = await categoryModel.findByClientId(currentUser.clientId);
    return res.status(200).json(categories);
  },

  /**
   * @description Updates a category.
   * @route PUT api/categories/:id
   */
  async updateCategory(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("Category ID is required.");
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      category.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to modify this category."
      );
    }

    const updatedCategory = await categoryModel.update(id, { name });
    return res.status(200).json(updatedCategory);
  },

  /**
   * @description Deletes a category.
   * @route DELETE api/categories/:id
   */
  async deleteCategory(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("Category ID is required.");
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.sendStatus(204);
    }

    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      category.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to delete this category."
      );
    }

    await categoryModel.remove(id);
    return res.sendStatus(204);
  },
};
