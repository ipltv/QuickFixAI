// backend/src/routes/auth.routes.ts
/**
 * @fileoverview This file defines the routes for user authentication.
 * It includes routes for login, logout, and token refresh.
 */
import { Router } from "express";
import { authenticationController } from "../controllers/authentication.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.post("/login", catchAsync(authenticationController.login));
router.post("/logout", catchAsync(authenticationController.logout));
router.post("/refresh", catchAsync(authenticationController.refresh));

export default router;
