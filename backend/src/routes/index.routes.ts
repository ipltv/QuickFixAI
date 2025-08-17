// backend/src/routes/index.ts
/**
 * @fileoverview This file sets up the main router for the backend, integrating all route modules.
 *  */
import express from "express";
import userRoutes from "./users.routes.js";
import authenticationRoutes from "./authentication.routes.js";
import clientRoutes from "./client.routes.js";
import knowledgeRoutes from "./knowledge.routes.js";
import ticketRoutes from "./ticket.routes.js";

const router = express.Router();

router.use("/api/auth", authenticationRoutes);
router.use("/api/users", userRoutes);
router.use("/api/client", clientRoutes);
router.use("/api/knowledge", knowledgeRoutes);
router.use("/api/tickets", ticketRoutes);

export default router;
