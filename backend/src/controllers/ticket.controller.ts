import type { Request, Response } from "express";
import { ticketModel } from "../model/ticketModel.js";
import { ticketMessageModel } from "../model/ticketMessageModel.js";
import { generateSuggestionForTicket } from "../services/ai.service.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors.js";
import type {
  NewTicketData,
  TicketUpdateData,
  NewTicketMessage,
  JwtPayload,
} from "../types/types.js";
import { ROLES, STATUSES } from "../types/types.js";

export const ticketController = {
  /**
   * @description Creates a new ticket. The first message is created via a transaction in the model.
   * @rout POST /tickets
   */
  async createTicket(req: Request, res: Response): Promise<Response> {
    const { category, subject, description, equipment_id, priority } = req.body;
    const currentUser = req.user as JwtPayload;
    const priorityNumber = Number(priority);

    if (!category || !subject || !description) {
      throw new BadRequestError(
        "Category, subject, and description are required."
      );
    }
    if (isNaN(priorityNumber) || priorityNumber < 1 || priorityNumber > 5) {
      throw new BadRequestError("Priority must be a number between 1 and 5.");
    }

    const newTicketData: NewTicketData = {
      client_id: currentUser.clientId,
      created_by: currentUser.userId,
      category,
      subject,
      description, // This will become the first message
      equipment_id,
      priority: priorityNumber,
      status: STATUSES.OPEN, // Default status for new tickets
    };

    const ticket = await ticketModel.create(newTicketData);
    // --- AI Suggestion Trigger ---
    // Call this without 'await' so the API can respond to the user immediately.
    // The AI generation will happen in the background.
    generateSuggestionForTicket(ticket).catch((err) => {
      // Catch potential errors here to prevent unhandled promise rejections.
      // The function itself already has internal logging.
      console.error(
        `Error during background AI processing for ticket ${ticket.id}:`,
        err.message
      );
    });

    // Respond to the user with the created ticket information.
    // The AI message will appear in the ticket thread shortly.
    return res.status(201).json(ticket);
  },

  /**
   * @description Gets all tickets for the user's client.
   * @route GET /tickets
   */
  async getTickets(req: Request, res: Response): Promise<Response> {
    const currentUser = req.user as JwtPayload;
    let filters: { clientId?: string; creatorId?: string } = {};

    // Determine filters based on user role
    if (currentUser.role === ROLES.STAFF) {
      filters.creatorId = currentUser.userId; // Staff can only see their own tickets
    } else if (currentUser.role === ROLES.CLIENT_ADMIN) {
      filters.clientId = currentUser.clientId; // Client admins can see all tickets in their client
    } else if (currentUser.role === ROLES.SYSTEM_ADMIN) {
      filters = {}; // System admins can see all tickets
    }
    const tickets = await ticketModel.findTickets(filters);
    return res.status(200).json(tickets);
  },

  /**
   * @description Gets a single ticket by ID, including its messages.
   * @route GET /tickets/:ticketId
   */
  async getTicketById(req: Request, res: Response): Promise<Response> {
    const { ticketId } = req.params;
    const currentUser = req.user as JwtPayload;

    if (!ticketId) {
      throw new BadRequestError("Ticket ID is required.");
    }
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // Authorization check
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      ticket.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this ticket."
      );
    }

    const messages = await ticketMessageModel.findByTicketId(ticketId);
    return res.status(200).json({ ...ticket, messages });
  },

  /**
   * @description Updates a ticket's status, priority, etc.
   * @route PUT /tickets/:ticketId
   */
  async updateTicket(req: Request, res: Response): Promise<Response> {
    const { ticketId } = req.params;
    const { status, priority, equipment_id } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!ticketId) {
      throw new BadRequestError("Ticket ID is required.");
    }

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // Authorization check
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      ticket.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to modify this ticket."
      );
    }
    // Staff can only update their own tickets
    if (
      currentUser.role === ROLES.STAFF &&
      ticket.created_by !== currentUser.userId
    ) {
      throw new ForbiddenError("You can only modify tickets that you created.");
    }

    const updateData: TicketUpdateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (equipment_id) updateData.equipment_id = equipment_id;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No fields to update provided.");
    }

    const updatedTicket = await ticketModel.update(ticketId, updateData);
    return res.status(200).json(updatedTicket);
  },

  /**
   * @description Adds a new message to an existing ticket.
   * @route POST /tickets/:ticketId/messages
   */
  async addMessage(req: Request, res: Response): Promise<Response> {
    const { ticketId } = req.params;
    const { content } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!ticketId) {
      throw new BadRequestError("Ticket ID is required.");
    }

    if (!content) {
      throw new BadRequestError("Message content is required.");
    }

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError("Ticket not found.");
    }

    // Authorization check
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      ticket.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this ticket."
      );
    }

    const newMessageData: NewTicketMessage = {
      ticket_id: ticketId,
      author_id: currentUser.userId,
      author_type: "user", // Can be enhanced later to distinguish 'support', etc.
      content,
      meta: {}, // Additional metadata can be added here if needed
    };

    const message = await ticketMessageModel.create(newMessageData);
    return res.status(201).json(message);
  },
};
