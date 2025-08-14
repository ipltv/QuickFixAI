// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { authenticationController } from '../controllers/authentication.controller.js';

/**
 * @description Routes for user authentication.
 * @route /api/auth
 * This file defines the authentication routes for login and logout.
 * It uses the authController to handle the logic for these routes.
 */
const router = Router();

router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);

export default router;