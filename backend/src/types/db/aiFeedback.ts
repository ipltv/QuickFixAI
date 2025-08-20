/**
 * Represents the full structure of the 'ai_feedback' table.
 */
export interface AiFeedbackDB {
  id: string;
  ai_response_id: string;
  ticket_id: string;
  user_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: Date;
}

/**
 * Type for creating new feedback.
 */
export type NewAiFeedback = Omit<AiFeedbackDB, "id" | "created_at">;
