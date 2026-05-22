import { BadRequestError } from "./errors.js";

/**
 * Normalizes an Express route param to a single string.
 * Express 5 types params as `string | string[]`.
 */
export const getRouteParam = (
  value: string | string[] | undefined,
  paramName: string
): string => {
  if (Array.isArray(value)) {
    throw new BadRequestError(`${paramName} must be a single value.`);
  }
  if (!value) {
    throw new BadRequestError(`${paramName} is required.`);
  }
  return value;
};
