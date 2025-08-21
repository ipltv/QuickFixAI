import type { User } from "../user/user.ts";

// --- Redux State Shape for the Auth Feature ---
// Define the shape of the authentication state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the type for login credentials
export type LoginCredentials = { email: string; password: string };
