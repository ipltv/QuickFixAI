// models/ticketMessageModel.ts
import db from "../db/db.js";
import type {
  TicketMessageDB,
  NewTicketMessage,
  TicketMessageUpdateData,
} from "../types/index.js";

const TABLE_NAME = "ticket_messages";

export const ticketMessageModel = {
  /**
   * Creates a new message and updates the `updated_at` on the parent ticket.
   * @param messageData - The data for the new message.
   * @returns The created message.
   */
  async create(messageData: NewTicketMessage): Promise<TicketMessageDB> {
    return db.transaction(async (trx) => {
      // 1. Insert the new message.
      const [message] = await trx<TicketMessageDB>(TABLE_NAME)
        .insert(messageData)
        .returning("*");

      if (!message) {
        throw new Error("Failed to create ticket message");
      }
      // 2. Update the `updated_at` field in the `tickets` table.
      await trx("tickets") //TODO: Refactor with service layer
        .where({ id: message.ticket_id })
        .update({ updated_at: new Date() });

      return message;
    });
  },

  /**
   * Finds all messages for a specific ticket, sorted by creation date.
   * @param ticketId - The ticket's UUID.
   * @returns An array of messages.
   */
  async findByTicketId(ticketId: string): Promise<TicketMessageDB[]> {
    return db<TicketMessageDB>(TABLE_NAME)
      .where({ ticket_id: ticketId })
      .orderBy("created_at", "asc");
  },

  /**
   * Updates a message's content and touches the parent ticket's 'updated_at' timestamp.
   * @param id - The UUID of the message to update.
   * @param updates - An object with the fields to update (e.g., content).
   * @returns The updated message object, or undefined if not found.
   */
  async update(
    id: string,
    updates: TicketMessageUpdateData
  ): Promise<TicketMessageDB | undefined> {
    return db.transaction(async (trx) => {
      // 1. Update the message itself.
      const [updatedMessage] = await trx<TicketMessageDB>(TABLE_NAME)
        .where({ id })
        .update(updates)
        .returning("*");

      if (!updatedMessage) {
        return undefined; // Message not found, transaction will be rolled back.
      }

      // 2. Touch the parent ticket's timestamp to reflect the new activity.
      await trx("tickets")
        .where({ id: updatedMessage.ticket_id })
        .update({ updated_at: new Date() });

      return updatedMessage;
    });
  },

  /**
   * Deletes a message by its ID.
   * @param id - The UUID of the message to delete.
   * @returns The number of deleted rows (1 if successful, 0 if not found).
   */
  async remove(id: string): Promise<number> {
    return db<TicketMessageDB>(TABLE_NAME).where({ id }).del();
  },
};
