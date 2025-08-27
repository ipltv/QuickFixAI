import { Router } from "express";
import { registrationController } from "../controllers/registration.controller.js";

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
 *                 required: true
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 required: true
 *               name:
 *                 type: string
 *                 required: true
 *               client_name:
 *                 type: string
 *                 required: true
 *               role:
 *                 type: string
 *                 required: true
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
router.post("/", registrationController.register);

export default router;
