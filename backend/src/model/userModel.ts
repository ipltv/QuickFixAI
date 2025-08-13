// models/userModel.ts
import db from "../db/db.js";
import { type UserDB } from "../types/types.js";

type NewUser = Omit<UserDB, "id" | "created_at">;

const TABLE_NAME = "users";

export const userModel = {
  /**
   * Creates a new user.
   * @param userData - { client_id, email, password_hash, role, name }.
   * @returns The created user. WARNING: password_hash is returned, but should not be exposed in controllers.
   */
  async create(userData: NewUser): Promise<UserDB> {
    const [user] = await db<UserDB>(TABLE_NAME)
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
};
