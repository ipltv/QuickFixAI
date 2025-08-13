// types/types.ts

/**
 * Represents the full structure of the 'clients' table.
 */
export interface ClientDB {
  id: string; // UUID
  name: string;
  settings: Record<string, any>; // JSONB
  created_at: Date;
}

/**
 * Represents the full structure of the 'users' table.
 */
export interface UserDB {
  id: string; // UUID
  client_id: string;
  email: string;
  password_hash: string;
  role: "staff" | "support" | "admin";
  name?: string;
  created_at: Date;
}

/**
 * Represents the full structure of the 'tickets' table.
 */
export interface TicketDB {
  id: string; // UUID
  client_id: string;
  created_by: string;
  category?: string;
  status: "open" | "in_progress" | "resolved" | "escalated";
  priority: number;
  subject?: string;
  description?: string;
  equipment_id?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Type for creating a new ticket, based on the full DB entity.
 */
export type NewTicketData = Omit<
  TicketDB,
  "id" | "created_at" | "updated_at" | "status" | "priority"
> & {
  description: string;
};

/**
 * Type for a ticket joined with creator and equipment details.
 */
export type TicketWithDetails = TicketDB & {
  creator_name?: string;
  creator_email?: string;
  equipment_name?: string;
};

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
}

/**
 * Represents the full structure of the 'knowledge_articles' table.
 */
export interface KnowledgeArticleDB {
  id: string; // UUID
  client_id: string;
  title?: string;
  content?: string;
  tags?: string[]; // TEXT[]
  embedding?: number[]; // VECTOR(1536)
  created_at: Date;
}

/**
 * Represents the full structure of the 'refresh_tokens' table.
 */
export interface RefreshTokenDB {
  id: string; // UUID
  token: string; // Hashed token
  user_id: string;
  expires_at: Date;
  created_at: Date;
}
