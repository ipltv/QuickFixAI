import type { UserDB } from "../types/index.js";

/**
 * @description Helper function to remove sensitive data from the user object before sending it to the client.
 * @param user - The user object from the database.
 * @returns The user object without the password hash.
 */
export const sanitizeUser = (user: UserDB): Omit<UserDB, "password_hash"> => {
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
};
