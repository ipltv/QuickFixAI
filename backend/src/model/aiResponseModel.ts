// models/aiResponseModel.ts
import db from "../db/db.js";
import type {
  AiResponseDB,
  NewAiResponse,
  AiResponseUpdateData,
} from "../types/index.js";

const TABLE_NAME = "ai_responses";

export const aiResponseModel = {
  /**
   * Logs a new AI response.
   * @param data - The data for the AI response.
   * @returns The created AI response object.
   */
  async create(data: NewAiResponse): Promise<AiResponseDB> {
    try {
      const [response] = await db<AiResponseDB>(TABLE_NAME)
        .insert(data)
        .returning("*");
      if (!response) throw new Error("AI response creation failed.");
      return response;
    } catch (error) {
      console.error("Error creating AI response:", error);
      throw error;
    }
  },

  /**
   * Finds an AI response by its ID.
   * @param id - The UUID of the AI response.
   * @returns The response object or undefined if not found.
   */
  async findById(id: string): Promise<AiResponseDB | undefined> {
    try {
      return db<AiResponseDB>(TABLE_NAME).where({ id }).first();
    } catch (error) {
      console.error(`Error finding AI response with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finds all AI responses for a given ticket.
   * @param ticketId - The UUID of the ticket.
   * @returns An array of AI response objects.
   */
  async findByTicketId(ticketId: string): Promise<AiResponseDB[]> {
    try {
      return db<AiResponseDB>(TABLE_NAME)
        .where({ ticket_id: ticketId })
        .orderBy("created_at", "asc");
    } catch (error) {
      console.error(
        `Error finding AI responses for ticket ID ${ticketId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Updates an AI response.
   * @param id - The UUID of the response to update.
   * @param updates - An object with fields to update.
   * @returns The updated response object or undefined if not found.
   */
  async update(
    id: string,
    updates: AiResponseUpdateData
  ): Promise<AiResponseDB | undefined> {
    try {
      const [updated] = await db<AiResponseDB>(TABLE_NAME)
        .where({ id })
        .update(updates)
        .returning("*");
      return updated;
    } catch (error) {
      console.error(`Error updating AI response with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an AI response.
   * @param id - The UUID of the response to delete.
   * @returns The number of deleted rows.
   */
  async remove(id: string): Promise<number> {
    try {
      return db<AiResponseDB>(TABLE_NAME).where({ id }).del();
    } catch (error) {
      console.error(`Error deleting AI response with ID ${id}:`, error);
      throw error;
    }
  },
};
