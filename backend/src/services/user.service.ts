import bcrypt from "bcrypt";
import type { NewUser, UserDB, NewUserInput } from "../types/index.js";
import { userModel } from "../model/userModel.js";
import { ROLES } from "../types/index.js";
import { ForbiddenError, ConflictError } from "../utils/errors.js";
import type { Knex } from "knex";

// The number of salt rounds for hashing the password.
const SALT_ROUNDS = 10;

type CreateUserOpts = {
  newUserData: NewUserInput;
  currentUser?: UserDB | null;
  trx?: Knex.Transaction;
};

export const userService = {
  async create(
    { newUserData, currentUser, trx }: CreateUserOpts
  ): Promise<UserDB> {
    // --- 1. Role checks ---
    if (currentUser) {
      // Authorization check: A client_admin can only create users for their own client.
      if (
        currentUser.role === ROLES.CLIENT_ADMIN &&
        currentUser.client_id !== newUserData.client_id
      ) {
        throw new ForbiddenError(
          "You can only create users for your own client."
        );
      }
      // A client_admin cannot create system admin.
      if (
        currentUser.role === ROLES.CLIENT_ADMIN &&
        newUserData.role === ROLES.SYSTEM_ADMIN
      ) {
        throw new ForbiddenError(
          "You are not permitted to create administrative users."
        );
      }
    } else {
      // If there is no current user, this must be the first user of the client.
      if (newUserData.role !== ROLES.CLIENT_ADMIN) {
        throw new ForbiddenError(
          "The first user must be a client administrator."
        );
      }
    }

    // --- 2. Check for duplicate email ---
    const existingUser = await userModel.findByEmail(newUserData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists.");
    }

    // --- 3. Hash password ---
    const password_hash = await bcrypt.hash(newUserData.password, SALT_ROUNDS);

    // 4. Create the user in the database
    const newUserPayload: NewUser = {
      ...newUserData,
      password_hash,
    };
    delete (newUserPayload as any).password;

    const createdUser = await userModel.create(newUserPayload, trx);
    return createdUser;
  },
};
