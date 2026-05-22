import bcrypt from "bcrypt";
import type { NewUser, UserDB, NewUserInput, Role } from "../types/index.js";
import { userModel } from "../model/userModel.js";
import { ROLES } from "../types/index.js";
import {
  ForbiddenError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../utils/errors.js";
import type { Knex } from "knex";

// The number of salt rounds for hashing the password.
const SALT_ROUNDS = 10;

export type PasswordChangeActor = {
  id: string;
  role: Role;
  client_id: string;
};

type CreateUserOpts = {
  newUserData: NewUserInput;
  currentUser?: UserDB | null;
  trx?: Knex.Transaction;
};

export const userService = {
  async create({
    newUserData,
    currentUser,
    trx,
  }: CreateUserOpts): Promise<UserDB> {
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

    const { password, client_id, ...userFields } = newUserData;
    if (!client_id) {
      throw new BadRequestError("client_id is required.");
    }

    // 4. Create the user in the database
    const newUserPayload: NewUser = {
      ...userFields,
      client_id,
      password_hash,
    };

    const createdUser = await userModel.create(newUserPayload, trx);
    return createdUser;
  },

  async updateUserPassword(
    currentUser: PasswordChangeActor,
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new BadRequestError(
        "currentPassword and newPassword are required."
      );
    }
    // Find the user for password update
    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check role permissions
    const isSelf = currentUser.id === userId;
    const isSystemAdmin = currentUser.role === ROLES.SYSTEM_ADMIN;
    const isClientAdmin =
      currentUser.role === ROLES.CLIENT_ADMIN &&
      currentUser.client_id === user.client_id;

    if (!isSelf && !isSystemAdmin && !isClientAdmin) {
      throw new ForbiddenError(
        "You aren't able to change password for the user."
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch && !isClientAdmin && !isSystemAdmin) {
      throw new BadRequestError("Current password is incorrect.");
    }

    // Update password
    user.password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userModel.updatePassword(userId, user.password_hash);
  },
};
