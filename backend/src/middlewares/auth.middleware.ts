// middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import type { JwtPayload } from '../types/types.js'; // Your custom payload type
/**
 * @description Middleware to authenticate requests using JWT.
 * It checks for the presence of a valid JWT in the Authorization header.
 * If valid, it attaches the user information to the request object.
 * If invalid or missing, it responds with a 401 Unauthorized status.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // 1. Check for the header and its 'Bearer ' format.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // 2. Extract the token from the header.
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    // 3. Verify the token using the secret from config.
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // If the token is expired or invalid, send 403 Forbidden.
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        // 4. If the token is valid, attach the payload to the request object.
        req.user = decoded as JwtPayload;
        next(); // Pass control to the next middleware or handler.
    });
};