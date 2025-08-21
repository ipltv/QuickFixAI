// export const PRIORITY_LEVELS = ["Planned", "Low", "Medium", "High", "Critical"] as const;
// export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
export const PRIORITY_LEVELS = {
  Planned: 1,
  Low: 2,
  Medium: 3,
  High: 4,
  Critical: 5,
} as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[keyof typeof PRIORITY_LEVELS];
