// models/aiFeedbackModel.ts
import db from "../db/db.js";
import type { AiFeedbackDB, NewAiFeedback } from "../types/types.js";
import { resolvedCaseModel } from "./resolvedCaseModel.js";
import { ticketModel } from "./ticketModel.js";
import { aiResponseModel } from "./aiResponseModel.js";
import { getEmbedding } from "../services/openai.service.js";
import { toVectorString } from "../helpers/toVectorString.js";

const TABLE_NAME = "ai_feedback";

export const aiFeedbackModel = {
  /**
   * Creates feedback. If rating is high (e.g., 5), also creates a resolved_case.
   * @param feedbackData - The data for the new feedback.
   * @returns The created feedback record.
   */
  async create(feedbackData: NewAiFeedback): Promise<AiFeedbackDB> {
    return db.transaction(async (trx) => {
      // Create the feedback record itself
      const [feedback] = await trx<AiFeedbackDB>(TABLE_NAME)
        .insert(feedbackData)
        .returning([
          "id",
          "ai_response_id",
          "ticket_id",
          "user_id",
          "rating",
          "comment",
          "created_at",
        ]);

      // If rating is 5, automatically create a resolved case
      if (feedback?.rating === 5) {
        // Fetch the necessary data from the ticket and AI response tables.
        const ticket = await ticketModel.findById(feedback.ticket_id);
        const aiResponse = await aiResponseModel.findById(
          feedback.ai_response_id
        );

        if (ticket && aiResponse) {
          // Generate an embedding for the problem description
          const problemContent = `${ticket.subject}\n${ticket.description}`;
          const problemEmbedding = await getEmbedding(problemContent);

          // Create the resolved case
          resolvedCaseModel.create({
            client_id: ticket.client_id,
            ticket_id: ticket.id,
            title: ticket.subject,
            problem_description: ticket.description,
            ai_response: aiResponse.response,
            tags: ticket.category ? [ticket.category] : [], // Use ticket category as a tag
            source: "feedback",
            created_by: feedback.user_id,
            embedding: toVectorString(problemEmbedding) as any, // TODO: review typing
          });
        }
      }

      return feedback as AiFeedbackDB;
    });
  },

  /**
   * Delete feedback.
   * @param id AI feedback ID
   * @returns Count of deleted rows (normaly 1).
   */
  async remove(id: string): Promise<number> {
    return db<AiFeedbackDB>(TABLE_NAME).where({ id }).del();
  },
};
