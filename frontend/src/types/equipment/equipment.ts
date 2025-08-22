import type { RequestStatus } from "../../types/index";

// --- Frontend Model for a Equipment ---
// Represents the data received from the backend API.
export interface Equipment {
  id: string;
  name: string;
  type: string;
  meta: {};
}

export interface NewEquipmentPayload {
  name: string;
  type: string;
  meta: {};
}

export interface EquipmentUpdatePayload {
  name?: string;
  type?: string;
  meta?: {};
}

// --- Redux State Shape for the Equipment Feature ---
export interface EquipmentState {
  items: Equipment[];
  status: RequestStatus;
  error: string | null;
}
