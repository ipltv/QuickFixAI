import type { NewUserPayload, User } from "../user/user.ts";
import type { RequestStatus } from "../misc/requestStatuses.ts";
import type { NewClientPayload } from "../client/client.ts";

// --- Redux State Shape for the Auth Feature ---
// Define the shape of the authentication state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: RequestStatus;
  error: string | null;
}

// Define the type for login credentials
export type LoginCredentials = { email: string; password: string };

// Define the type for registration credentials
export type RegistrationCredentials = NewClientPayload &
  Omit<NewUserPayload, "client_id">;
