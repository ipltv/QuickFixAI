// backend/src/config/env.ts
// This file is responsible for loading environment variables from a .env file
// and ensuring that all required variables are defined.
import dotenv from "dotenv";

// Load environment variables from the appropriate .env file.
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

// A list of all required environment variables.
const requiredVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_SECRET_EXPIRATION",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_SECRET_EXPIRATION",
  "FRONTEND_URL",
  "PORT",
  "OPENAI_API_KEY",
  "AI_EMBEDDING_MODEL",
  "AI_SUGGESTIONS_MODEL",
  "RESOLVED_CASE_DISTANCE_THRESHOLD",
  "NODE_ENV",
] as const;

const env = {} as Record<(typeof requiredVars)[number], string>;

// Check if each required variable is defined.
for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is not defined!`);
    // Exit the process if a required variable is missing.
    process.exit(1);
  }
  env[key] = process.env[key] as string;
}

// Export the environment variables for use in other files.
// We use type assertions to tell TypeScript that these values exist.
export const DATABASE_URL = env.DATABASE_URL; // Database connection string
export const JWT_SECRET = env.JWT_SECRET; // JWT secret for signing tokens
export const JWT_SECRET_EXPIRATION = env.JWT_SECRET_EXPIRATION; // JWT expiration time
export const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET; // JWT secret for signing refresh tokens
export const JWT_REFRESH_SECRET_EXPIRATION = env.JWT_REFRESH_SECRET_EXPIRATION; // JWT refresh token expiration time
export const FRONTEND_URL = env.FRONTEND_URL; //Origin URL for CORS
export const PORT = env.PORT; // Port on which the backend server will run
export const OPENAI_API_KEY = env.OPENAI_API_KEY; // OpenAI API key
export const AI_EMBEDDING_MODEL = env.AI_EMBEDDING_MODEL; // Model for getting embeddings
export const AI_SUGGESTIONS_MODEL = env.AI_SUGGESTIONS_MODEL; // Model for getting ticket suggestions
export const RESOLVED_CASE_DISTANCE_THRESHOLD = parseFloat(
  env.RESOLVED_CASE_DISTANCE_THRESHOLD
); // Threshold for matching resolved cases. Lower values mean a stricter match.
export const NODE_ENV = env.NODE_ENV; // Environment mode (development, production)
