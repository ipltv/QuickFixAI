import type { Request, Response } from "express";
import { userModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import type { UserDB, NewUser } from "../types/types.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "../utils/errors.js";
import { type Role, ROLES } from "../types/types.js";

// The number of salt rounds for hashing the password.
const SALT_ROUNDS = 10;

/**
 * @description Helper function to remove sensitive data from the user object before sending it to the client.
 * @param user - The user object from the database.
 * @returns The user object without the password hash.
 */
const sanitizeUser = (user: UserDB): Omit<UserDB, "password_hash"> => {
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * @description Validates the role of a user.
 * This function checks if the provided role is one of the predefined roles.
 * @param role - The role to validate.
 * @returns Is the role valid?
 */

export const isValidRole = (role: any): role is Role => {
  return ROLES.includes(role);
};

export const userController = {
  /**
   * @description Creates a new user.
   * @route POST /api/users
   */
  async createUser(req: Request, res: Response): Promise<Response> {
    const { client_id, email, password, role, name } = req.body;

    // 1. Validate input data
    if (!email || !password || !role || !client_id || !name) {
      throw new BadRequestError(
        "Missing required fields: client_id, email, password, role, name."
      );
    }
    if (!isValidRole(role)) {
      // Provide a helpful error message showing the valid options.
      throw new BadRequestError(
        `Invalid role specified. Must be one of: ${ROLES.join(", ")}.`
      );
    }

    // 2. Check if a user with this email already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists.");
    }

    // 3. Hash the password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Create the user in the database
    const newUserPayload: NewUser = {
      client_id,
      email,
      password_hash,
      role,
      name,
    };
    const createdUser = await userModel.create(newUserPayload);

    // 5. Send a sanitized response
    return res.status(201).json(sanitizeUser(createdUser));
  },

  /**
   * @description Gets a user by their ID.
   * @route GET /api/users/:id
   */
  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("User ID is required.");
    }
    const user = await userModel.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return res.status(200).json(sanitizeUser(user));
  },

  /**
   * @description Updates a user's data.
   * @route PUT /api/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { email, role, name } = req.body;
    if (!id) {
      throw new BadRequestError("User ID is required.");
    }
    // Data for the update. We exclude any attempts to update the password or client_id via this endpoint.
    const updateData: Partial<Omit<NewUser, "password_hash" | "client_id">> =
      {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (name) updateData.name = name;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No fields to update provided.");
    }

    const updatedUser = await userModel.update(id, updateData);

    return res.status(200).json(sanitizeUser(updatedUser));
  },

  /**
   * @description Deletes a user.
   * @route DELETE /api/users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("User ID is required.");
    }
    const deletedCount = await userModel.remove(id);

    if (deletedCount === 0) {
      throw new NotFoundError("User not found.");
    }

    // The standard response for a successful deletion is 204 No Content
    return res.sendStatus(204);
  },

  /**
   * @description Gets the profile of the currently authenticated user.
   * @route GET /api/users/me
   */
  async getMeProfile(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized: No user information found.");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json(sanitizeUser(user));
  },
};
