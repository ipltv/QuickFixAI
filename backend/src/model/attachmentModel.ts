// models/attachmentModel.ts
import db from "../db/db.js";
import type { AttachmentDB, NewAttachment, AttachmentUpdateData } from "../types/types.js";

const TABLE_NAME = "attachments";

export const attachmentModel = {
  /**
   * Creates a new attachment record in the database.
   * @param data - The data for the new attachment.
   * @returns The created attachment object.
   */
  async create(data: NewAttachment): Promise<AttachmentDB> {
    try {
      const [attachment] = await db<AttachmentDB>(TABLE_NAME).insert(data).returning("*");
      if (!attachment) throw new Error("Attachment creation failed.");
      return attachment;
    } catch (error) {
      console.error("Error creating attachment record:", error);
      throw error;
    }
  },

  /**
   * Finds an attachment by its ID.
   * @param id - The UUID of the attachment.
   * @returns The attachment object or undefined if not found.
   */
  async findById(id: string): Promise<AttachmentDB | undefined> {
    try {
      return db<AttachmentDB>(TABLE_NAME).where({ id }).first();
    } catch (error) {
      console.error(`Error finding attachment with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finds all attachments for a given ticket.
   * @param ticketId - The UUID of the ticket.
   * @returns An array of attachment objects.
   */
  async findByTicketId(ticketId: string): Promise<AttachmentDB[]> {
    try {
      return db<AttachmentDB>(TABLE_NAME).where({ ticket_id: ticketId });
    } catch (error) {
      console.error(`Error finding attachments for ticket ID ${ticketId}:`, error);
      throw error;
    }
  },
  
  /**
   * Updates an attachment's metadata.
   * @param id - The UUID of the attachment to update.
   * @param updates - The data to update (e.g., filename).
   * @returns The updated attachment object or undefined if not found.
   */
  async update(id: string, updates: AttachmentUpdateData): Promise<AttachmentDB | undefined> {
    try {
      const [updated] = await db<AttachmentDB>(TABLE_NAME).where({ id }).update(updates).returning("*");
      return updated;
    } catch (error) {
      console.error(`Error updating attachment with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an attachment record from the database.
   * Note: This does NOT delete the file from storage (e.g., S3).
   * That logic should be handled in a service layer.
   * @param id - The UUID of the attachment to delete.
   * @returns The number of deleted rows.
   */
  async remove(id: string): Promise<number> {
    try {
      return db<AttachmentDB>(TABLE_NAME).where({ id }).del();
    } catch (error) {
      console.error(`Error deleting attachment with ID ${id}:`, error);
      throw error;
    }
  },
};