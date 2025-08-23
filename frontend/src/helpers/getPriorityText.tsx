import { PRIORITY_LEVELS } from "../types/index";

export const getPriorityText = (level: number): string => {
  const entry = Object.entries(PRIORITY_LEVELS).find(
    ([, value]) => value === level
  );
  return entry ? entry[0] : "Unknown"; // Return the key (e.g., "Medium") or a fallback
};

export default getPriorityText;
