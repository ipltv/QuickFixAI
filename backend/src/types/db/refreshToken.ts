/**
 * Represents the full structure of the 'refresh_tokens' table.
 */
export interface RefreshTokenDB {
  id: string; // UUID
  token: string; // Hashed token
  user_id: string;
  expires_at: Date;
  created_at: Date;
}

/**
 * Type for creating a new token record.
 */
export type NewRefreshToken = Omit<RefreshTokenDB, "id" | "created_at">;
