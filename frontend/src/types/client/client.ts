import type { RequestStatus } from "../misc/requestStatuses";

// --- Frontend Model for a Client ---
// Represents the data received from the backend API.
export interface Client {
  id: string;
  name: string;
  settings: string;
  created_at: string;
}

export interface NewClientPayload {
  name: string;
  settings: string;
}

export interface ClientUpdatePayload {
  name?: string;
  settings?: string;
}

// --- Redux State Shape for the Client Feature ---
export interface ClientState {
  items: Client[];
  status: RequestStatus;
  error: string | null;
}
