import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with the .openapi() method
extendZodWithOpenApi(z);

// Schema for path parameters containing a ticketId
export const ticketIdParamsSchema = z.object({
  params: z.object({
    ticketId: z.string().openapi({
      format: "uuid",
      description: "The ID of the ticket.",
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
  }),
});

// Schema for query parameters when fetching a list of tickets
export const getTicketsQuerySchema = z.object({
  query: z.object({
    limit: z.string().transform(Number).optional().openapi({
      description: "Number of items to return.",
      example: 10,
    }),
    offset: z.string().transform(Number).optional().openapi({
      description: "Number of items to skip.",
      example: 0,
    }),
    status: z.string().optional().openapi({
      description: "Filter by ticket status.",
      example: "open",
    }),
  }),
});

// Schema for the request body when creating a ticket
export const createTicketSchema = z
  .object({
    body: z.object({
      category_id: z.string().openapi({
        format: "uuid",
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "The ID of the ticket category.",
      }),
      subject: z.string().min(1).openapi({
        description: "A brief subject line for the ticket.",
        example: "POS terminal is not printing receipts.",
      }),
      description: z.string().min(1).openapi({
        description: "The full description of the issue.",
        example:
          "When I try to print a receipt, the printer makes a noise but nothing comes out.",
      }),
      equipment_id: z.string().uuid().optional().openapi({
        description: "(Optional) The ID of the related equipment.",
        example: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
      }),
      priority: z.number().int().min(1).max(5).openapi({
        description: "The priority of the ticket (1-5).",
        example: 3,
      }),
    }),
  })
  .openapi("CreateTicketRequest");

// Schema for the ticket response object when creating a ticket
export const ticketResponseSchema = z
  .object({
    id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    client_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    created_by: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    category_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    status: z.string(),
    priority: z.number().int(),
    subject: z.string(),
    description: z.string(),
    equipment_id: z
      .string()
      .openapi({
        format: "uuid",
        example: "123e4567-e89b-12d3-a456-426614174000",
      })
      .nullable(),
    created_at: z.string().openapi({ format: "date-time" }),
    updated_at: z.string().openapi({ format: "date-time" }),
  })
  .openapi("Ticket");

// Schema for the response when fetching a list of tickets
export const getTicketsResponseSchema = z
  .array(ticketResponseSchema)
  .openapi("TicketsResponse");

// Schema for the request body when updating a ticket.
export const updateTicketSchema = z
  .object({
    body: createTicketSchema.shape.body.partial(),
  })
  .openapi("UpdateTicketRequest");

// Schema for adding a message to a ticket
export const addMessageSchema = z
  .object({
    body: z.object({
      text: z.string().min(1).openapi({
        description: "The content of the message.",
        example: "I have tried restarting the device, but it didn't help.",
      }),
    }),
  })
  .openapi("AddMessageRequest");

// Schema for a message response object
export const messageResponseSchema = z
  .object({
    id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    ticket_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    author_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    text: z.string(),
    created_at: z.string().openapi({ format: "date-time" }),
  })
  .openapi("Message");

// Schema for adding feedback to a ticket
export const addFeedbackSchema = z
  .object({
    body: z.object({
      rating: z.number().int().min(1).max(5).openapi({
        description: "A rating from 1 to 5.",
        example: 5,
      }),
      comment: z.string().optional().openapi({
        description: "(Optional) A comment about the service.",
        example: "The issue was resolved very quickly!",
      }),
    }),
  })
  .openapi("AddFeedbackRequest");

//Schema for a feedback response object
export const feedbackResponseSchema = z
  .object({
    id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    ai_response_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    ticket_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    user_id: z.string().openapi({
      format: "uuid",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    rating: z.number().int().min(1).max(5).openapi({
      description: "A rating from 1 to 5.",
      example: 5,
    }),
    comment: z.string().nullable().openapi({
      description: "(Optional) A comment about the service.",
      example: "The issue was resolved very quickly!",
    }),
    created_at: z.string().openapi({ format: "date-time" }),
  })
  .openapi("Feedback");
