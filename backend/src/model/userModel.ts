// models/userModel.ts
import db from "../db/db.js";
import type { UserDB, NewUser } from "../types/index.js";
import type { Knex } from "knex";

const TABLE_NAME = "users";

export const userModel = {
  /**
   * Creates a new user.
   * @param userData - { client_id, email, password_hash, role, name }.
   * @returns The created user. WARNING: password_hash is returned, but should not be exposed in controllers.
   */
  async create(userData: NewUser, trx?: Knex.Transaction): Promise<UserDB> {
    const [user] = await (db || trx)<UserDB>(TABLE_NAME)
      .insert(userData)
      .returning([
        "id",
        "client_id",
        "email",
        "password_hash",
        "role",
        "name",
        "created_at",
      ]);
    return user as UserDB;
  },

  /**
   * Updates an existing user.
   * @param id - The user's UUID.
   * @param userData - Partial user data to update (excluding password_hash).
   * @returns The updated user or undefined if not found.
   */
  async update(
    id: string,
    userData: Partial<Omit<NewUser, "password_hash">>
  ): Promise<UserDB> {
    try {
      const [user] = await db<UserDB>(TABLE_NAME)
        .where({ id })
        .update(userData) // Update only the fields provided
        .returning([
          "id",
          "client_id",
          "email",
          "password_hash",
          "role",
          "name",
          "created_at",
        ]);
      if (!user) {
        throw new Error("User not found");
      }
      return user as UserDB;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  },

  /**
   * Deletes a user by their ID.
   * @param id - The user's UUID.
   * @returns The number of deleted rows (0 or 1).
   */
  async remove(id: string): Promise<number> {
    return db<UserDB>(TABLE_NAME).where({ id }).del();
  },

  /**
   * Finds a user by their email address.
   * @param email - The user's email.
   * @returns The found user.
   */
  async findByEmail(email: string): Promise<UserDB | undefined> {
    return db<UserDB>(TABLE_NAME).where({ email }).first();
  },
  /**
   * Finds a user by their ID.
   * @param id - The user's UUID.
   * @returns The found user or undefined.
   */
  async findById(id: string): Promise<UserDB | undefined> {
    return db<UserDB>(TABLE_NAME).where({ id }).first();
  },

  /**
   * Finds all users for a specific client.
   * @param client_id - (Optional) The client's ID.
   * @returns An array of users belonging to the specified client.
   */
  async findAllByClient(client_id: string = ""): Promise<UserDB[]> {
    if (client_id) {
      return db<UserDB>(TABLE_NAME).where({ client_id }).select();
    }
    return db<UserDB>(TABLE_NAME).select();
  },
};
