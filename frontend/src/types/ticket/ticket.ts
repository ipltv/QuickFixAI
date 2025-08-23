import type { RequestStatus } from "../misc/requestStatuses";
import type { PriorityLevel } from "./priority";

// Define the possible ticket statuses in the application
export const STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  ESCALATED: "escalated",
} as const;

export type TicketStatus = (typeof STATUSES)[keyof typeof STATUSES];

// --- Frontend Model for a Ticket ---
// Represents the data received from the backend API.
export interface Ticket {
  id: string;
  client_id: string;
  created_by: string;
  category_id: string;
  category_name?: string; // Joined from the categories table
  status: TicketStatus;
  priority: PriorityLevel;
  subject: string;
  description: string;
  equipment_id: string | null;
  equipment_name?: string; // Joined from the equipment table
  creator_name?: string; // Joined from the users table
  client_name?: string; // Joined from the clients table
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  author_type: string;
  content: string;
  meta: object;
  created_at: string;
  ai_response_id?: string | null;
  author_name?: string | null;
  author_role?: string | null;
}

// The shape of the data returned from the GET /tickets/:ticketId endpoint
export interface TicketWithMessages extends Ticket {
  messages: TicketMessage[];
}
// The shape of tha data sending to the server on POST /tickets endpoint
export interface NewTicketPayload {
  category_id: string;
  subject: string;
  description: string;
  equipment_id?: string | null | undefined;
  priority: PriorityLevel;
}

// The shape of the data sending to the server on PUT /tickets/:ticketId endpoint
export interface TicketUpdatePayload {
  category_id?: string;
  status?: TicketStatus;
  subject?: string;
  description?: string;
  equipment_id?: string | null | undefined;
  priority?: PriorityLevel;
}

// --- Redux State Shape for the Tickets Feature ---
export interface TicketsState {
  tickets: Ticket[];
  status: RequestStatus;
  error: string | null;
  selectedTicket: TicketWithMessages | null;
}
