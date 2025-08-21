/**
 * @fileoverview This service orchestrates the AI suggestion generation process.
 * It uses a two-step retrieval process:
 * 1. Search for a highly similar, previously resolved case.
 * 2. If none is found, fall back to generating a new suggestion from the knowledge base.
 */
import { knowledgeArticleModel } from "../model/knowledgeArticleModel.js";
import { aiResponseModel } from "../model/aiResponseModel.js";
import { ticketMessageModel } from "../model/ticketMessageModel.js";
import { categoryModel } from "../model/categoryModel.js";
import { resolvedCaseModel } from "../model/resolvedCaseModel.js";
import { getEmbedding, getChatCompletion } from "./openai.service.js";
import { io } from "../server.js";
import type { CategoryDB, TicketDB } from "../types/index.js";
import {
  AI_SUGGESTIONS_MODEL,
  RESOLVED_CASE_DISTANCE_THRESHOLD,
} from "../config/env.js";
import { encoding_for_model } from "tiktoken";
import type { TiktokenModel } from "tiktoken";

const enc = encoding_for_model(AI_SUGGESTIONS_MODEL as TiktokenModel);

/**
 * @description Helper function for trim text (articles) by token length.
 * @param text Text for triming.
 * @param maxTokens Maximum token length for the text.
 * @returns Trimed text.
 */
const trimToTokens = (text: string, maxTokens: number): string => {
  const tokens = enc.encode(text);
  if (tokens.length <= maxTokens) return text;
  const trimmedTokens = tokens.slice(0, maxTokens);
  return enc.decode(trimmedTokens).toString();
};

/**
 * @description Constructs a detailed prompt for the AI based on ticket data and knowledge base context.
 * @param ticket - The ticket object.
 * @param contextArticles - Relevant articles from the knowledge base.
 * @returns A formatted prompt string.
 */
const buildPrompt = (
  ticket: TicketDB,
  ticketCategory: CategoryDB | null,
  contextArticles: any[]
): string => {
  const context = contextArticles
    .map(
      (article) =>
        `- Article: "${article.title}"\n  Content: ${trimToTokens(
          article.content,
          200
        )}...`
    )
    .join("\n");

  return `
    You are an AI support assistant for a quick-service restaurant.
    A staff member has submitted a support ticket. Your task is to provide a clear, step-by-step troubleshooting guide.

    **Problem Description:**
    - Ticket Subject: ${ticket.subject}
    - Ticket Category: ${ticketCategory ? ticketCategory.name : "Unknown"}
    - Full Description: ${ticket.description}

    **Relevant Knowledge Base Articles:**
    ${context.length > 0 ? context : "No relevant articles found."}

    **Instructions:**
    Based on the problem description and the provided articles, generate a set of numbered, actionable steps for the user to follow.
    If the articles provide a direct solution, use it. If not, use your general troubleshooting knowledge for restaurant equipment.
    Keep the language simple and direct. Address the user as "you".
    Start your response with "Here are a few steps you can try to resolve the issue:".
  `;
};

/**
 * @description Generates an AI suggestion for a given ticket and saves it.
 * This function is designed to run in the background ("fire-and-forget").
 * @param ticket - The newly created ticket object.
 */
export const generateSuggestionForTicket = async (ticket: TicketDB) => {
  try {
    console.log(
      `[AI Service] Starting suggestion generation for ticket ${ticket.id}`
    );

    // Get embedding for the ticket's content to find relevant articles.
    const ticketContent = `${ticket.subject}\n${ticket.description}`;
    const embedding = await getEmbedding(ticketContent);
    let aiSuggestion: string | null = null;
    let prompt: string | null = null;

    // --- Step 1: Search for a similar resolved case ---
    const similarCases = await resolvedCaseModel.semanticSearch(
      ticket.client_id,
      embedding,
      1
    );
    const bestMatch = similarCases[0];
    console.log("Similar cases:", similarCases);
    if (bestMatch && bestMatch.distance < RESOLVED_CASE_DISTANCE_THRESHOLD) {
      console.log(
        `[AI Service] Found a strong match in resolved cases with distance: ${bestMatch.distance}`
      );
      aiSuggestion = `We found a previously resolved ticket that seems very similar. Here is the proven solution:\n\n${bestMatch.content}`;
      prompt = `Resolved case used: ${bestMatch.id}`; // For logging purposes
    } else {
      // --- Step 2: Fallback to general knowledge base search ---
      console.log(
        "[AI Service] No strong match found. Falling back to knowledge base search."
      );
      const contextArticles = await knowledgeArticleModel.semanticSearch(
        ticket.client_id,
        embedding,
        3
      );
      const ticketCategory =
        (await categoryModel.findById(ticket.category_id)) || null;
      console.log(
        `[AI Service] Found ${contextArticles.length} relevant articles.`
      );
      // Build the prompt for the AI model.
      prompt = buildPrompt(ticket, ticketCategory, contextArticles);
      // Get the chat completion from OpenAI.
      aiSuggestion = await getChatCompletion(prompt);
    }

    if (!aiSuggestion) {
      throw new Error("AI service returned an empty suggestion.");
    }
    console.log(
      `[AI Service] Generated suggestion: "${aiSuggestion.substring(0, 50)}..."`
    );

    // Save the full AI interaction for logging and auditing.
    const aiResponseLog =await aiResponseModel.create({
      ticket_id: ticket.id,
      user_id: ticket.created_by, // Associate with the user who created the ticket
      model: AI_SUGGESTIONS_MODEL, //gpt-4o-mini
      prompt,
      response: aiSuggestion,
    });

    // Save the AI suggestion as a new message in the ticket thread.
    const aiMessage = await ticketMessageModel.create({
      ticket_id: ticket.id,
      author_id: ticket.created_by, // TODO: Replace on system or AI user
      author_type: "ai",
      content: aiSuggestion,
      meta: {},
      ai_response_id: aiResponseLog.id,
    });

    // Emit an event to the specific ticket's room
    // The frontend will be listening for this 'newMessage' event
    io.to(ticket.id).emit("newMessage", aiMessage);

    console.log(
      `[AI Service] Successfully saved and broadcasted suggestion for ticket ${ticket.id}`
    );
  } catch (error) {
    console.error(
      `[AI Service] Failed to generate suggestion for ticket ${ticket.id}:`,
      error
    );
    // TODO: if fell add this job to a retry queue.
  }
};
