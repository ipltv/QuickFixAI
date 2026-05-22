import { ticketModel } from "../model/ticketModel.js";
import type { JwtPayload } from "../types/index.js";
import { ROLES } from "../types/misc/roles.js";

/**
 * Returns whether the user may access the ticket (read/messages via WebSocket or HTTP).
 * Mirrors tenant checks used in ticket.controller getTicketById.
 */
export async function userCanAccessTicket(
  user: JwtPayload,
  ticketId: string
): Promise<boolean> {
  const ticket = await ticketModel.findById(ticketId);
  if (!ticket) {
    return false;
  }
  if (user.role === ROLES.SYSTEM_ADMIN) {
    return true;
  }
  return ticket.client_id === user.clientId;
}
