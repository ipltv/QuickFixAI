// models/ticketModel.ts

/**
 * @fileoverview This file contains the ticket model for managing ticket-related database operations.
 * It includes methods for creating, finding, updating, and deleting tickets,
 * as well as retrieving tickets by client ID.
 */

import db from "../db/db.js";
import type {
  TicketDB,
  NewTicketData,
  TicketWithDetails,
  TicketUpdateData,
  TicketFilters,
} from "../types/index.js";
import { categoryModel } from "./categoryModel.js";

const TABLE_NAME = "tickets";

export const ticketModel = {
  /**
   * Creates a new ticket and its first message in a single transaction.
   * @param ticketData - The data for the new ticket.
   * @returns The created ticket.
   */
  async create(ticketData: NewTicketData): Promise<TicketDB> {
    return db.transaction(async (trx) => {
      const [ticket] = await trx<TicketDB>(TABLE_NAME)
        .insert(ticketData)
        .returning("*");

      if (!ticket) {
        throw new Error("Failed to create ticket");
      }
      if (ticketData.description) {
        await trx("ticket_messages").insert({
          ticket_id: ticket.id,
          author_id: ticket.created_by,
          author_type: "user",
          content: ticketData.description,
          meta: {},
        });
      }

      return ticket;
    });
  },

  /**
   * Finds a ticket by ID and joins it with user and equipment details.
   * @param id - The ticket's UUID.
   * @returns The found ticket with extra details.
   */
  async findById(id: string): Promise<TicketWithDetails | undefined> {
    return db<TicketDB>(TABLE_NAME)
      .where(`${TABLE_NAME}.id`, id)
      .leftJoin("users", "tickets.created_by", "users.id")
      .leftJoin("equipment", "tickets.equipment_id", "equipment.id")
      .leftJoin(
        "ticket_categories",
        "tickets.category_id",
        "ticket_categories.id"
      )
      .select(
        "tickets.*",
        "users.name as creator_name",
        "users.email as creator_email",
        "equipment.name as equipment_name",
        "ticket_categories.name as category_name"
      )
      .first();
  },

  /**
   * Updates a ticket's data and automatically sets the 'updated_at' timestamp.
   * @param id - The UUID of the ticket to update.
   * @param updates - An object with the fields to update.
   * @returns The updated ticket object, or undefined if not found.
   */
  async update(
    id: string,
    updates: TicketUpdateData
  ): Promise<TicketDB | undefined> {
    const [updatedTicket] = await db<TicketDB>(TABLE_NAME)
      .where({ id })
      .update({
        ...updates,
        updated_at: new Date(), // Automatically update the timestamp
      })
      .returning("*");

    return updatedTicket;
  },

  /**
   * Deletes a ticket by its ID.
   * Note: This will also delete all associated ticket_messages due to ON DELETE CASCADE.
   * @param id - The UUID of the ticket to delete.
   * @returns The number of deleted rows (1 if successful, 0 if not found).
   */
  async remove(id: string): Promise<number> {
    return db<TicketDB>(TABLE_NAME).where({ id }).del();
  },

  /**
   * Finds all tickets for a specific client.
   * @param clientId - The client's UUID.
   * @returns An array of tickets.
   */
  async findAllByClientId(clientId: string): Promise<TicketDB[]> {
    return db<TicketDB>(TABLE_NAME)
      .where({ client_id: clientId })
      .orderBy("updated_at", "desc");
  },

  /**
   * Finds tickets based on a set of filters and applies pagination.
   * @param filters - The filter and pagination options.
   * @returns An array of tickets.
   */
  async findTickets(filters: TicketFilters): Promise<TicketDB[]> {
    const query = db<TicketDB>(TABLE_NAME);

    // Apply filters
    if (filters.clientId) {
      query.where("client_id", filters.clientId);
    }
    if (filters.creatorId) {
      query.where("created_by", filters.creatorId);
    }
    if (filters.status) {
      query.where("status", filters.status);
    }

    // Apply pagination
    if (filters.limit) {
      query.limit(filters.limit);
    }
    if (filters.offset) {
      query.offset(filters.offset);
    }

    // Order by the most recently updated tickets
    return query.orderBy("updated_at", "desc");
  },
};
