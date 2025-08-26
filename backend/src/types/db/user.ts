import type { Role } from "../misc/roles.js";

/**
 * Represents the full structure of the 'users' table.
 */
export interface UserDB {
  id: string; // UUID
  client_id: string;
  email: string;
  password_hash: string;
  role: Role;
  name: string;
  created_at: Date;
}

/**
 * Type for creating a new user, based on the full DB entity.
 */
export type NewUser = Omit<UserDB, "id" | "created_at">;

/**
 * Type for creating a new user input, excluding hashed password which will be generated.
 */
export type NewUserInput = Omit<UserDB, "id" | "created_at" | "password_hash"> & {
  password: string;
};