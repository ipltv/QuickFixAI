/**
 * Represents the full structure of the 'ai_responses' table.
 */
export interface AiResponseDB {
  id: string;
  ticket_id: string;
  user_id: string;
  model?: string;
  prompt?: string;
  response: string;
  tokens_used?: number;
  created_at: Date;
}

/**
 * Type for logging a new AI response.
 */
export type NewAiResponse = Omit<AiResponseDB, "id" | "created_at">;

/**
 * Type for updating an AI response (less common, but possible).
 */
export type AiResponseUpdateData = Partial<
  Omit<AiResponseDB, "id" | "ticket_id" | "user_id" | "created_at">
>;
