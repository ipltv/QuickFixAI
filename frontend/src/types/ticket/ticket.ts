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
  priority: number;
  subject: string;
  description: string;
  equipment_id: string | null;
  equipment_name?: string; // Joined from the equipment table
  creator_name?: string; // Joined from the users table
  created_at: string;
  updated_at: string;
}

// --- Redux State Shape for the Tickets Feature ---
export interface TicketsState {
  tickets: Ticket[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
