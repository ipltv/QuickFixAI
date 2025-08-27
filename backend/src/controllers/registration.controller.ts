import type { Request, Response } from "express";
import { clientService } from "../services/client.service.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";
import type { NewClient, NewUserInput } from "../types/index.js";
import { sanitizeUser } from "../utils/sanitize.js";

export const registrationController = {
  register: async (req: Request, res: Response) => {
    const { email, password, role, name, client_name, client_settings } =
      req.body;

    if (
      !email ||
      !password ||
      !role ||
      !name ||
      !client_name ||
      !client_settings
    ) {
      throw new BadRequestError("All fields are required");
    }

    try {
      const newClientPayload: NewClient = {
        name: client_name,
        settings: client_settings,
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
      res.status(201).json({ client, user: sanitizeUser(owner) });
    } catch (error) {
      console.error("Error registering client and user:", error);
      throw new InternalServerError();
    }
  },
};
