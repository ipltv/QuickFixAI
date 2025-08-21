// frontend/src/config/env.ts
// This file is responsible for loading environment variables for the frontend application.

// Importing the environment variables from the build tool (Vite).
const requiredVars = ["VITE_API_URL", "VITE_WS_URL"] as const;

const env = {} as Record<(typeof requiredVars)[number], string>;

// Check if each required variable is defined.
for (const key of requiredVars) {
  const value = import.meta.env[key];

  if (!value) {
    console.error(`Environment variable ${key} is not defined!`);
    throw new Error(`Environment variable ${key} is not defined!`);
  }

  env[key] = value;
}

// Export the environment variables for use in other files.
export const API_URL = env.VITE_API_URL;
export const WS_URL = env.VITE_WS_URL;
