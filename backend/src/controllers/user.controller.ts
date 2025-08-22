import type { Request, Response } from "express";
import { userModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import type { UserDB, NewUser, JwtPayload } from "../types/index.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/errors.js";
import { type Role, ROLES } from "../types/index.js";

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
  return Object.values(ROLES).includes(role);
};

/**
 * @description Helper function for client_admin authorization.
 * Checks if a client_admin is permitted to act on a target user.
 * @param adminUser - The authenticated client_admin user from req.user.
 * @param targetUser - The user being accessed or modified.
 */
const authorizeClientAdmin = (adminUser: JwtPayload, targetUser: UserDB) => {
  // A client_admin can only manage users within their own client.
  if (adminUser.clientId !== targetUser.client_id) {
    throw new ForbiddenError(
      "You do not have permission to access users from other clients."
    );
  }
  // A client_admin can only manage staff and support roles. They cannot edit other admins.
  if (targetUser.role !== ROLES.STAFF && targetUser.role !== ROLES.SUPPORT) {
    throw new ForbiddenError(
      "You can only manage users with 'staff' or 'support' roles."
    );
  }
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
        `Invalid role specified. Must be one of: ${Object.values(ROLES).join(
          ", "
        )}.`
      );
    }
    // Authorization check: A client_admin can only create users for their own client.
    const currentUser = req.user;
    if (
      currentUser?.role === ROLES.CLIENT_ADMIN &&
      currentUser.clientId !== client_id
    ) {
      throw new ForbiddenError(
        "You can only create users for your own client."
      );
    }
    // A client_admin cannot create system admin.
    if (
      currentUser?.role === ROLES.CLIENT_ADMIN &&
      role === ROLES.SYSTEM_ADMIN
    ) {
      throw new ForbiddenError(
        "You are not permitted to create administrative users."
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
   * @description Gets all possible users.
   * @route GET /api/users
   */
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    const currentUser = req.user as JwtPayload;
    if (!currentUser) {
      throw new UnauthorizedError("Unauthorized: No user information found.");
    }
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      const users = await userModel.findAllByClient(currentUser.clientId);
      return res.status(200).json(users.map(sanitizeUser));
    }
    if (currentUser.role === ROLES.SYSTEM_ADMIN) {
      const users = await userModel.findAllByClient();
      return res.status(200).json(users.map(sanitizeUser));
    }
    throw new ForbiddenError("You do not have permission to view users.");
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
    const targetUser = await userModel.findById(id);

    if (!targetUser) {
      throw new NotFoundError("User not found.");
    }

    // **Authorization Logic**
    const currentUser = req.user as JwtPayload;
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      authorizeClientAdmin(currentUser, targetUser);
    }

    return res.status(200).json(sanitizeUser(targetUser));
  },

  /**
   * @description Updates a user's data.
   * @route PUT /api/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { email, role, name, password } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("User ID is required.");
    }
    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      throw new NotFoundError("User not found.");
    }

    // **Authorization Logic**
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      authorizeClientAdmin(currentUser, targetUser);
    }
    // Data for the update. We exclude any attempts to update client_id via this endpoint.
    const updateData: Partial<Omit<NewUser, "client_id">> = {};
    if (email) updateData.email = email;
    if (role) {
      if (!isValidRole(role)) {
        throw new BadRequestError(
          `Invalid role specified. Must be one of: ${Object.values(ROLES).join(
            ", "
          )}.`
        );
      }
      // Prevent a client_admin from escalating privileges
      if (
        currentUser.role === ROLES.CLIENT_ADMIN &&
        (role === ROLES.CLIENT_ADMIN || role === ROLES.SYSTEM_ADMIN)
      ) {
        throw new ForbiddenError("You cannot assign administrative roles.");
      }
      updateData.role = role;
    }
    if (name) updateData.name = name;
    if (password)
      updateData.password_hash = await bcrypt.hash(password, SALT_ROUNDS);

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
    const currentUser = req.user as JwtPayload;
    if (!id) {
      throw new BadRequestError("User ID is required.");
    }
    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      // We still return 204 for idempotency, but we check first for auth.
      return res.sendStatus(204);
    }
    // **Authorization Logic**
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      authorizeClientAdmin(currentUser, targetUser);
    }
    await userModel.remove(id);
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
