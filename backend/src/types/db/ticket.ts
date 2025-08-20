import { type TicketStatus } from "../misc/statuses.js";

/**
 * Represents the full structure of the 'tickets' table.
 */
export interface TicketDB {
  id: string; // UUID
  client_id: string;
  created_by: string;
  category_id: string;
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
 *
 * Defines the structure for filtering tickets.
 */
export type TicketFilters = {
  clientId?: string;
  creatorId?: string;
  status?: string;
  limit?: number;
  offset?: number;
};
