/**
 * @fileoverview This file defines the routes for user management.
 * It includes routes for creating, retrieving, updating, and deleting users.
 */

import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";

const router = Router();
const resource = "users";

// Protected routes with role-based access control
// This middleware checks if the user is authenticated and has the right permissions for the 'users'
router.use(authMiddleware, checkPermission(resource));

router.post("/", catchAsync(userController.createUser));
router.get("/me", catchAsync(userController.getMeProfile));
router.get("/:id", catchAsync(userController.getUserById));
router.put("/:id", catchAsync(userController.updateUser));
router.delete("/:id", catchAsync(userController.deleteUser));

export default router;
