/**
 * @fileoverview This file defines the ticket routes for the application.
 * It includes routes for creating, retrieving, updating, and deleting tickets,
 * as well as adding messages to tickets.
 */

import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();
const resource = "tickets";

// All ticket routes require authentication and permission checks.
router.use(authMiddleware, checkPermission(resource));

// Routes for the main ticket resource
router.post("/", catchAsync(ticketController.createTicket));
router.get("/", catchAsync(ticketController.getTickets));
router.get("/:ticketId", catchAsync(ticketController.getTicketById));
router.put("/:ticketId", catchAsync(ticketController.updateTicket));

// Nested route for adding messages to a ticket
router.post("/:ticketId/messages", catchAsync(ticketController.addMessage));

export default router;
