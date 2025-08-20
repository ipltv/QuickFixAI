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
import { validate } from "../middlewares/validation.middleware.js";
import {
  createTicketSchema,
  getTicketsQuerySchema,
} from "../schemas/ticket.schema.js";

const router = Router();
const resource = "tickets";

// All ticket routes require authentication and permission checks.
router.use(authMiddleware, checkPermission(resource));

// Routes for the main ticket resource
/**
 * @route POST /api/tickets
 * @summary Create a new ticket
 * @description Create a new ticket with a category, subject, description, optional equipment, and priority.
 * @param {string} category_id.body.required - The ID of the ticket category. Example: "123e4567-e89b-12d3-a456-426614174000"
 * @param {string} subject.body.required - A brief subject line for the ticket. Example: "POS terminal is not printing receipts."
 * @param {string} description.body.required - The full description of the issue. Example: "When I try to print a receipt, the printer makes a noise but nothing comes out."
 * @param {string} equipment_id.body.optional - (Optional) The ID of the related equipment. Example: "b2c3d4e5-f6a7-8901-2345-67890abcdef1"
 * @param {number} priority.body.required - The priority of the ticket (1-5). Example: 3
 * @returns {object} 201 - The created ticket object
 * @returns {object} 400 - Validation error
 */
router.post(
  "/",
  validate(createTicketSchema),
  catchAsync(ticketController.createTicket)
);

/**
 * @route GET /api/tickets
 * @summary Fetch a list of tickets
 * @description Returns a paginated list of tickets. Can filter by status.
 * @param {number} limit.query - Number of items to return
 * @param {number} offset.query - Number of items to skip
 * @param {string} status.query - Filter tickets by status
 * @returns {Array<Ticket>} 200 - List of tickets
 */
router.get(
  "/",
  validate(getTicketsQuerySchema),
  catchAsync(ticketController.getTickets)
);

router.get("/:ticketId", catchAsync(ticketController.getTicketById));
router.put("/:ticketId", catchAsync(ticketController.updateTicket));

// Nested route for adding messages and feedback to a ticket
router.post("/:ticketId/messages", catchAsync(ticketController.addMessage));
router.post("/:ticketId/feedback", catchAsync(ticketController.addFeedback));

export default router;
