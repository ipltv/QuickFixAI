// models/refreshTokenModel.ts
import db from "../db/db.js";
import type { RefreshTokenDB, NewRefreshToken } from "../types/index.js";

const TABLE_NAME = "refresh_tokens";

export const refreshTokenModel = {
  /**
   * Stores a new refresh token.
   * @param tokenData - { token (hashed), user_id, expires_at }.
   * @returns The created token record.
   */
  async create(tokenData: NewRefreshToken): Promise<RefreshTokenDB> {
    const [token] = await db<RefreshTokenDB>(TABLE_NAME)
      .insert(tokenData)
      .returning(["id", "token", "user_id", "expires_at", "created_at"]);
    return token as RefreshTokenDB;
  },

  /**
   * Finds a token record by the token value.
   * REMEMBER: The 'token' parameter should be the HASHED token.
   * @param token - The hashed refresh token string.
   * @returns The found token record or undefined.
   */
  async findByToken(token: string): Promise<RefreshTokenDB | undefined> {
    return db<RefreshTokenDB>(TABLE_NAME).where({ token }).first();
  },

  /**
   * Deletes a specific token by its value.
   * @param token - The hashed refresh token string.
   * @returns The number of deleted rows (0 or 1).
   */
  async removeByToken(token: string): Promise<number> {
    return db<RefreshTokenDB>(TABLE_NAME).where({ token }).del();
  },

  /**
   * Updates a refresh token record by its ID.
   * @param id - The ID of the refresh token record to update.
   * @param updates - The fields to update in the token record.
   * @returns - The updated token record.
   */
  async update(id: string, updates: Partial<NewRefreshToken>): Promise<RefreshTokenDB> {
    const [updatedToken] = await db<RefreshTokenDB>(TABLE_NAME)
      .where({ id })
      .update(updates).returning(["id", "token", "user_id", "expires_at", "created_at"]);
    return updatedToken as RefreshTokenDB
  },
};
  
