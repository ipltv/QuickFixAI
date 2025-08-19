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
