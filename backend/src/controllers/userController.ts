import type { Request, Response } from 'express';
import { userModel } from '../model/userModel.js';
import bcrypt from 'bcrypt';
import type { UserDB, NewUser } from '../types/types.js';
// NOTE: Authorization logic should be implemented for this controller.
// The number of salt rounds for hashing the password.
const SALT_ROUNDS = 10;

/**
 * @description Helper function to remove sensitive data from the user object before sending it to the client.
 * @param user - The user object from the database.
 * @returns The user object without the password hash.
 */
const sanitizeUser = (user: UserDB): Omit<UserDB, 'password_hash'> => {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
};

export const userController = {
    /**
     * @description Creates a new user.
     * @route POST /api/users
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const { client_id, email, password, role, name } = req.body;

            // 1. Validate input data
            if (!email || !password || !role || !client_id) {
                return res.status(400).json({ message: 'Missing required fields: client_id, email, password, role.' });
            }

            // 2. Check if a user with this email already exists
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }

            // 3. Hash the password
            const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

            // 4. Create the user in the database
            const newUserPayload: NewUser = { client_id, email, password_hash, role, name };
            const createdUser = await userModel.create(newUserPayload);

            // 5. Send a sanitized response
            return res.status(201).json(sanitizeUser(createdUser));

        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    /**
     * @description Gets a user by their ID.
     * @route GET /api/users/:id
     */
    async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'User ID is required.' });
            }
            const user = await userModel.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json(sanitizeUser(user));

        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    /**
     * @description Updates a user's data.
     * @route PUT /api/users/:id
     */
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { email, role, name } = req.body;
            if (!id) {
                return res.status(400).json({ message: 'User ID is required.' });
            }
            // Data for the update. We exclude any attempts to update the password or client_id via this endpoint.
            const updateData: Partial<Omit<NewUser, 'password_hash' | 'client_id'>> = {};
            if (email) updateData.email = email;
            if (role) updateData.role = role;
            if (name) updateData.name = name;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: 'No fields to update provided.' });
            }

            // NOTE: Authorization logic is also required here.
            const updatedUser = await userModel.update(id, updateData);

            return res.status(200).json(sanitizeUser(updatedUser));

        } catch (error) {
            // The model throws an error if the user is not found, which we catch here.
            if (error instanceof Error && error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found.' });
            }
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    /**
     * @description Deletes a user.
     * @route DELETE /api/users/:id
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'User ID is required.' });
            }
            // NOTE: This operation must be strictly protected. Implement with authMiddleware.
            // Only company administrators should be able to delete users.

            const deletedCount = await userModel.remove(id);

            if (deletedCount === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // The standard response for a successful deletion is 204 No Content
            return res.status(204).send();

        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};