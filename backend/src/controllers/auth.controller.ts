// controllers/auth.controller.ts

import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { NODE_ENV, JWT_REFRESH_SECRET_EXPIRATION } from '../config/env.js';
import { parseExpirationToMs } from '../helpers/parseExpirationToMs.js';

export const authController = {
    /**
     * @description Handles user login.
     * @route POST /api/auth/login
     */
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const { accessToken, refreshToken } = await authService.loginUser(email, password);

            // Send the refresh token in a secure httpOnly cookie.
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: NODE_ENV === 'production', // In production, use secure: true (for HTTPS).
                sameSite: 'strict',
                maxAge: parseExpirationToMs(JWT_REFRESH_SECRET_EXPIRATION),
                path: '/api/auth', // Restrict the cookie's path.
            });

            // Send the access token in the response body.
            return res.status(200).json({ accessToken });

        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    /**
     * @description Handles user logout.
     * @route POST /api/auth/logout
     */
    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const { refreshToken } = req.cookies;
            if (refreshToken) {
                await authService.logoutUser(refreshToken);
            }

            // Clear the cookie.
            res.clearCookie('refreshToken', { path: '/api/auth' });
            return res.status(204).send(); // No content.

        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};