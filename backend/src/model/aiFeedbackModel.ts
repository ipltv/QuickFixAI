// models/aiFeedbackModel.ts
import db from "../db/db.js";
import type { AiFeedbackDB, TicketDB, AiResponseDB, NewAiFeedback } from "../types/types.js";


export const aiFeedbackModel = {
  /**
   * Creates feedback. If rating is high (e.g., 5), also creates a resolved_case.
   * @param feedbackData - The data for the new feedback.
   * @returns The created feedback record.
   */
  async create(feedbackData: NewAiFeedback): Promise<AiFeedbackDB> {
    return db.transaction(async (trx) => {
      // 1. Create the feedback record itself.
      const [feedback] = await trx<AiFeedbackDB>("ai_feedback")
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

      // 2. If rating is 5, automatically create a resolved case.
      if (feedback?.rating === 5) {
        // Fetch the necessary data from the ticket and AI response tables.
        const ticket = await trx<TicketDB>("tickets")
          .where({ id: feedback.ticket_id })
          .first();
        const aiResponse = await trx<AiResponseDB>("ai_responses")
          .where({ id: feedback.ai_response_id })
          .first();

        if (ticket && aiResponse) {
          await trx("resolved_cases").insert({
            client_id: ticket.client_id,
            ticket_id: ticket.id,
            title: ticket.subject,
            problem_description: ticket.description,
            ai_response: aiResponse.response,
            tags: ticket.category ? [ticket.category] : [], // Use ticket category as a tag
            source: "feedback",
            created_by: feedback.user_id,
          });
        }
      }

      return feedback as AiFeedbackDB;
    });
  },
};
