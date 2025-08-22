import type { Role } from "../misc/roles.js";
import type { RequestStatus } from "../misc/requestStatuses.js";

// Define the User type with required fields
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  client_id: string;
}

export interface NewUserPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
  client_id: string;
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
  client_id?: string;
}

// --- Redux State Shape for the User Feature ---
export interface UserState {
  users: User[];
  status: RequestStatus;
  error: string | null;
}
