// backend/src/routes/client.routes.ts

/**
 * @fileoverview This file defines the routes for client-related operations.
 * It includes routes for creating, retrieving, updating, and deleting clients.
 * The routes are protected by authentication middleware.
 */

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { clientController } from "../controllers/client.controller.js";
import { catchAsync } from "../utils/catchAsync.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";

const router = Router();
const resource = "clients";

// Protected routes with role-based access control
// This middleware checks if the user is authenticated and has the right permissions for the 'clients'
router.use(authMiddleware, checkPermission(resource));

router.get("/", catchAsync(clientController.getAllClients));
router.post("/", catchAsync(clientController.createClient));
router.get("/profile", catchAsync(clientController.getProfile));
router.put("/:id", catchAsync(clientController.updateClient));
router.delete("/:id", catchAsync(clientController.deleteClient));

export default router;
