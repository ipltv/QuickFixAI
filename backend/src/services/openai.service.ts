/**
 * @fileoverview This service encapsulates all interactions with the OpenAI API.
 * It handles client initialization, API calls, and error handling.
 */

import OpenAI from "openai";
import {
  OPENAI_API_KEY,
  AI_EMBEDDING_MODEL,
  AI_SUGGESTIONS_MODEL,
} from "../config/env.js";
import { InternalServerError } from "../utils/errors.js";

// Initialize the OpenAI client with the API key from our environment variables.
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * @description Generates a vector embedding for a given text string.
 * @param text - The input string to embed.
 * @returns A promise that resolves to an array of numbers (the embedding vector).
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  try {
    // Make the API call to the embeddings endpoint.
    const response = await openai.embeddings.create({
      model: AI_EMBEDDING_MODEL, // Embedding model should produce vectors of size 1536. 'text-embedding-ada-002'
      input: text.replace(/\n/g, " "), // replacing newlines with spaces.
      dimensions: 1536, // Explicitly request 1536 dimensions to match pgvector.
    });

    // Validate the response and extract the embedding.
    const embedding = response?.data?.[0]?.embedding;
    if (!embedding) {
      throw new Error("Invalid response structure from OpenAI API.");
    }

    return embedding;
  } catch (error) {
    console.error("Error fetching embedding from OpenAI:", error);
    // Throw a standardized server error to be caught by your global error handler.
    throw new InternalServerError("Failed to generate text embedding.");
  }
};

/**
 * @description Gets a text response from the OpenAI chat model.
 * @param prompt - The detailed prompt for the AI.
 * @returns A promise that resolves to the AI's response string.
 */
export const getChatCompletion = async (
  prompt: string
): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: AI_SUGGESTIONS_MODEL, // 'gpt-4o-mini
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant.", // General system message
        },
        {
          role: "user",
          content: prompt, // The detailed prompt generated in ai.service levele
        },
      ],
      temperature: 0.5, // A bit of creativity but still factual
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(
        "Invalid response structure from OpenAI API for chat completion."
      );
    }
    return content;
  } catch (error) {
    console.error("Error fetching chat completion from OpenAI:", error);
    throw new InternalServerError("Failed to generate AI suggestion.");
  }
};
