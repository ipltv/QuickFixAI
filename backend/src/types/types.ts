// types/types.ts
/**
 * This file defines the types used across the application, including database entities and data transfer objects (DTOs).
 *  */

// BEGIN: DB types
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
 * Type for creating a new client, based on the full DB entity.
 */
export type NewClient = Pick<ClientDB, "name" | "settings">;

/**
 * Represents the full structure of the 'users' table.
 */
export interface UserDB {
  id: string; // UUID
  client_id: string;
  email: string;
  password_hash: string;
  role: Role;
  name: string;
  created_at: Date;
}

/**
 * Type for creating a new user, based on the full DB entity.
 */
export type NewUser = Omit<UserDB, "id" | "created_at">;

/**
 * Type for ticket statuses.
 * This is a constant object that defines the possible statuses a ticket can have.
 */
export const STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  ESCALATED: "escalated",
} as const;
export type TicketStatus = (typeof STATUSES)[keyof typeof STATUSES];
/**
 * Represents the full structure of the 'tickets' table.
 */
export interface TicketDB {
  id: string; // UUID
  client_id: string;
  created_by: string;
  category?: string;
  status: TicketStatus;
  priority: number;
  subject: string;
  description: string;
  equipment_id?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Type for creating a new ticket, based on the full DB entity.
 */
export type NewTicketData = Omit<
  TicketDB,
  "id" | "created_at" | "updated_at"
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
 * Type for the update payload. Users shouldn't update IDs or creation dates.
 * This is a partial type of TicketDB excluding certain fields.
 */
export type TicketUpdateData = Partial<
  Omit<
    TicketDB,
    "id" | "client_id" | "created_by" | "created_at" | "updated_at"
  >
>;

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
 * Type for creating a new message.
 */
export type NewTicketMessage = Omit<TicketMessageDB, "id" | "created_at">;

/**
 * Type for updating a message. Typically, only content and meta.
 */
export type TicketMessageUpdateData = Partial<
  Pick<TicketMessageDB, "content" | "meta">
>;

/**
 * Represents the full structure of the 'knowledge_articles' table.
 */
export interface KnowledgeArticleDB {
  id: string; // UUID
  client_id: string;
  title: string;
  content: string;
  tags?: string[]; // TEXT[]
  embedding: number[]; // VECTOR(1536)
  created_at: Date;
}

/**
 * Type for creating a new knowledge article, based on the full DB entity.
 */
export type NewKnowledgeArticle = Omit<KnowledgeArticleDB, "id" | "created_at">;

/**
 * Type for the update payload. Only specific fields should be updatable.
 */
export type KnowledgeArticleUpdateData = Partial<
  Pick<KnowledgeArticleDB, "title" | "content" | "tags" | "embedding">
>;

/**
 * Type for search results, which includes the distance metric.
 */
export type SearchResult = Pick<
  KnowledgeArticleDB,
  "id" | "title" | "content" | "tags"
> & {
  distance: number;
};

/**
 * Represents the full structure of the 'equipment' table.
 */
export interface EquipmentDB {
  id: string;
  client_id: string;
  name: string;
  type?: string;
  meta: Record<string, any>;
  created_at: Date;
}

/**
 * Type for creating new equipment..
 */
export type NewEquipment = Omit<EquipmentDB, "id" | "created_at">;

/**
 * Type for updating equipment.
 */
export type EquipmentUpdateData = Partial<
  Omit<EquipmentDB, "id" | "client_id" | "created_at">
>;

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

/**
 * Represents the full structure of the 'attachments' table.
 */
export interface AttachmentDB {
  id: string; // UUID
  ticket_id: string;
  client_id: string;
  url?: string;
  filename?: string;
  meta?: Record<string, any>; // JSONB
  created_at: Date;
}

/**
 * Type for creating a new attachment record.
 */
export type NewAttachment = Omit<AttachmentDB, "id" | "created_at">;
/**
 * Type for updating an attachment's metadata.
 */
export type AttachmentUpdateData = Partial<
  Pick<AttachmentDB, "filename" | "meta">
>;

/**
 * Represents the full structure of the 'resolved_cases' table.
 */
export interface ResolvedCaseDB {
  id: string;
  client_id: string;
  ticket_id: string;
  title: string;
  problem_description: string;
  ai_response: string;
  tags?: string[];
  source: "feedback" | "manual";
  embedding: number[]; // VECTOR(1536)
  created_by?: string;
  created_at: Date;
}

/**
 * Type for creating a new resolved case.
 */
export type NewResolvedCase = Omit<ResolvedCaseDB, "id" | "created_at">;

/**
 * Type for updating a resolved case.
 */
export type ResolvedCaseUpdateData = Partial<
  Omit<ResolvedCaseDB, "id" | "client_id" | "created_at">
>;

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

/**
 * Type for creating a new token record.
 */
export type NewRefreshToken = Omit<RefreshTokenDB, "id" | "created_at">;

// END: DB types

// BEGIN: JWT types

/**
 * Represents the payload structure of a JWT token.
 */
export interface JwtPayload {
  userId: string; // User ID
  name: string; // User name
  email: string; // User email
  role: Role; // User role
  clientId: string; // Client ID
}

// END: JWT types

// BEGIN: Misc types

// Represents the possible user roles in the system.
export const ROLES = {
  CLIENT_ADMIN: "client_admin",
  SYSTEM_ADMIN: "system_admin",
  STAFF: "staff",
  SUPPORT: "support",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

// END: Misc types
