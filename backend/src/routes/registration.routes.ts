import { Router } from "express";
import { registrationController } from "../controllers/registration.controller.js";
import { authenticationController } from "../controllers/authentication.controller.js";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               client_name:
 *                 type: string
 *               client_settings:
 *                 type: object
 *                 properties:
 *                   setting1:
 *                     type: string
 *                   setting2:
 *                     type: string
 *                   setting3:
 *                     type: string
 *     responses:
 *       201:
 *         description: Client and user registered successfully
 *       409:
 *         description: User with this email already exists
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  registrationController.register,
  authenticationController.login
);

export default router;
