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
   * Finds tickets based on optional filters for client ID and creator ID.
   * @param filters - An object containing optional clientId and creatorId.
   * @returns An array of tickets matching the filters.
   */
  async findTickets(filters: {
    clientId?: string;
    creatorId?: string;
  }): Promise<TicketDB[]> {
    let query = db<TicketDB>(TABLE_NAME).select("*");

    if (filters.clientId) {
      query = query.where("client_id", filters.clientId);
    }
    if (filters.creatorId) {
      query = query.where("created_by", filters.creatorId);
    }

    return query;
  },
};
