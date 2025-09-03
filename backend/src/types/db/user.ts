import type { Role } from "../misc/roles.js";
import type { Optional, PartialExcept } from "../utils.js";

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
 * Represents a user without the password hash.
 */
export type UserSanitized = Omit<UserDB, "password_hash">;

/**
 * Type for creating a new user, based on the full DB entity.
 * Ready to insert in DB type.
 */
export type NewUser = Omit<UserDB, "id" | "created_at">;

/**
 * Type for creating a new user input, excluding hashed password which will be generated.
 * The client_id is optional to allow for initial user creation without a client.
 */
export type NewUserInput =
  Omit<UserDB, "id" | "created_at" | "password_hash"> & {
  password: string;
};

/**
 * Type for updating user input, excluding fields that should not be changed.
 */
export type UpdateUserInput = PartialExcept<
  Omit<UserDB, "created_at" | "client_id">,
  "id"
>;
