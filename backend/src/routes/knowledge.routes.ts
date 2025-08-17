import { Router } from "express";
import { knowledgeController } from "../controllers/knowledge.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();
const resource = "knowledge_articles";

// All routes require authentication first.
router.use(authMiddleware);

// Special route for semantic search, accessible to all roles.
router.post("/search", catchAsync(knowledgeController.searchArticles));

// Apply RBAC middleware for all subsequent routes.
router.use(checkPermission(resource));

// Define CRUD routes
router.post("/", catchAsync(knowledgeController.createArticle));
router.get("/", catchAsync(knowledgeController.getArticles));
router.get("/:id", catchAsync(knowledgeController.getArticleById));
router.put("/:id", catchAsync(knowledgeController.updateArticle));
router.delete("/:id", catchAsync(knowledgeController.deleteArticle));

export default router;
