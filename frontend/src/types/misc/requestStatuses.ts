// --- Object Literal as an Enum for Request Statuses ---

// Define the possible request statuses in the application for Redux slices and etc.
export const REQUEST_STATUSES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];
