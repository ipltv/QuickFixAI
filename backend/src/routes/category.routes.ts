/**
 * @fileoverview This file defines the routes for managing ticket categories.
 * It includes routes for creating, retrieving, updating, and deleting categories.
 * The routes are protected by authentication and role-based access control middleware.
 */

import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();
const resource = "ticket_categories";

router.use(authMiddleware, checkPermission(resource));

router.post("/", catchAsync(categoryController.createCategory));
router.get("/", catchAsync(categoryController.getCategories));
router.put("/:id", catchAsync(categoryController.updateCategory));
router.delete("/:id", catchAsync(categoryController.deleteCategory));

export default router;
