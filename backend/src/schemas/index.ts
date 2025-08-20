import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  ticketIdParamsSchema,
  getTicketsQuerySchema,
  createTicketSchema,
  ticketResponseSchema,
  getTicketsResponseSchema,
  updateTicketSchema,
  addMessageSchema,
  messageResponseSchema,
  addFeedbackSchema,
  feedbackResponseSchema,
} from "./ticket.schema.js";

// This registry holds all the Zod schemas that convert to OpenAPI schemas.
export const registry = new OpenAPIRegistry();

// Register the schemas with the registry.
// The name you provide here is what you'll use in your JSDoc $ref.
registry.register("TicketIdParams", ticketIdParamsSchema);
registry.register("GetTicketsQuery", getTicketsQuerySchema);
registry.register("CreateTicketRequest", createTicketSchema);
registry.register("Ticket", ticketResponseSchema);
registry.register("GetTicketsResponse", getTicketsResponseSchema);
registry.register("UpdateTicketRequest", updateTicketSchema);
registry.register("AddMessageRequest", addMessageSchema);
registry.register("Message", messageResponseSchema);
registry.register("AddFeedbackRequest", addFeedbackSchema);
registry.register("Feedback", feedbackResponseSchema);
