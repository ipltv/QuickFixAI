import type { RequestStatus } from "../../types/index";

// --- Frontend Model for a Category ---
// Represents the data received from the backend API.
export interface Category {
  id: string;
  client_id: string;
  name: string;
  created_at: string;
}

// --- Redux State Shape for the Category Feature ---
export interface CategoryState {
  items: Category[];
  status: RequestStatus;
  error: string | null;
}
