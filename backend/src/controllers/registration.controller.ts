import type { Request, Response } from "express";
import { clientService } from "../services/client.service.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";
import type { NewClient, NewUserInput } from "../types/index.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { authService } from "../services/auth.service.js";
import { NODE_ENV, JWT_REFRESH_SECRET_EXPIRATION } from "../config/env.js";
import { parseExpirationToMs } from "../helpers/parseExpirationToMs.js";

/**
 * Registration controller
 * @description Handles new client and user registration. Only for initial client setup.
 */
export const registrationController = {
  register: async (req: Request, res: Response) => {
    const { email, password, role, name, client_name, settings } = req.body;

    if (!email || !password || !role || !name || !client_name || !settings) {
      throw new BadRequestError("All fields are required");
    }

    try {
      const newClientPayload: NewClient = {
        name: client_name,
        settings,
      };
      const newUserPayload: NewUserInput = {
        email,
        password,
        role,
        name,
      };
      const { client, owner } = await clientService.createClientWithOwner(
        newClientPayload,
        newUserPayload
      );

      // Automatically log in the new user after registration
      const tokens = await authService.loginUser(owner.email, password);

      // Send the refresh token in a secure httpOnly cookie.
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseExpirationToMs(JWT_REFRESH_SECRET_EXPIRATION),
        path: "/api/auth", // Restrict the cookie's path.
      });

      // Send the access token in the response body.
      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error("Error registering client and user:", error);
      throw new InternalServerError();
    }
  },
};
