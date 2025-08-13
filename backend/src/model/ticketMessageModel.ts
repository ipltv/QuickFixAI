// models/ticketMessageModel.ts
import db from "../db/db.js";
import type { TicketMessageDB } from "../types/types.js";

// Type for creating a new message.
type NewTicketMessage = Omit<TicketMessageDB, "id" | "created_at">;

export const ticketMessageModel = {
  /**
   * Creates a new message and updates the `updated_at` on the parent ticket.
   * @param messageData - The data for the new message.
   * @returns The created message.
   */
  async create(messageData: NewTicketMessage): Promise<TicketMessageDB> {
    return db.transaction(async (trx) => {
      // 1. Insert the new message.
      const [message] = await trx<TicketMessageDB>("ticket_messages")
        .insert(messageData)
        .returning([
          "id",
          "ticket_id",
          "author_id",
          "author_type",
          "content",
          "meta",
          "created_at",
        ]);

      if (!message) {
        throw new Error("Failed to create ticket message");
      }
      // 2. Update the `updated_at` field in the `tickets` table.
      await trx("tickets")
        .where({ id: message.ticket_id })
        .update({ updated_at: new Date() });

      return message as TicketMessageDB;
    });
  },

  /**
   * Finds all messages for a specific ticket, sorted by creation date.
   * @param ticketId - The ticket's UUID.
   * @returns An array of messages.
   */
  async findByTicketId(ticketId: string): Promise<TicketMessageDB[]> {
    return db<TicketMessageDB>("ticket_messages")
      .where({ ticket_id: ticketId })
      .orderBy("created_at", "asc");
  },
};
