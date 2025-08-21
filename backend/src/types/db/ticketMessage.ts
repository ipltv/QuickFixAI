/**
 * Represents the full structure of the 'ticket_messages' table.
 */
export interface TicketMessageDB {
  id: string; // UUID
  ticket_id: string;
  author_id: string;
  author_type: "user" | "ai" | "support";
  content: string;
  meta: Record<string, any>; // JSONB
  created_at: Date;
  ai_response_id?: string;
}

/**
 * Type for creating a new message.
 */
export type NewTicketMessage = Omit<TicketMessageDB, "id" | "created_at">;

/**
 * Type for updating a message. Typically, only content and meta.
 */
export type TicketMessageUpdateData = Partial<
  Pick<TicketMessageDB, "content" | "meta">
>;
