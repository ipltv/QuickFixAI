/**
 * @fileoverview This service encapsulates all interactions with the OpenAI API.
 * It handles client initialization, API calls, and error handling.
 */

import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";
import { InternalServerError } from "../utils/errors.js";

// 1. Initialize the OpenAI client with the API key from our environment variables.
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 2. Define the model to use. 'text-embedding-3-small' is efficient and produces
//    vectors of size 1536.
const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * @description Generates a vector embedding for a given text string.
 * @param text - The input string to embed.
 * @returns A promise that resolves to an array of numbers (the embedding vector).
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  try {
    // 3. Make the API call to the embeddings endpoint.
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.replace(/\n/g, " "), // replacing newlines with spaces.
      dimensions: 1536, // Explicitly request 1536 dimensions to match pgvector.
    });

    // 4. Validate the response and extract the embedding.
    const embedding = response?.data?.[0]?.embedding;
    if (!embedding) {
      throw new Error("Invalid response structure from OpenAI API.");
    }

    return embedding;
  } catch (error) {
    console.error("Error fetching embedding from OpenAI:", error);
    // 5. Throw a standardized server error to be caught by your global error handler.
    throw new InternalServerError("Failed to generate text embedding.");
  }
};
