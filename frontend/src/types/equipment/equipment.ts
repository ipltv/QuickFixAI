import type { RequestStatus } from "../../types/index";

// --- Frontend Model for a Equipment ---
// Represents the data received from the backend API.
export interface Equipment {
  id: string;
  client_id: string;
  name: string;
  type: string;
  meta: {};
}

export interface NewEquipmentPayload {
  name: string;
  client_id: string;
  type: string;
  meta: Record<string, unknown>;
}

export interface EquipmentUpdatePayload {
  name?: string;
  client_id?: string;
  type?: string;
  meta?: {};
}

// --- Redux State Shape for the Equipment Feature ---
export interface EquipmentState {
  items: Equipment[];
  status: RequestStatus;
  error: string | null;
}
