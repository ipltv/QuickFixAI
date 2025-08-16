import type { Request, Response } from "express";
import { clientModel } from "../model/clientModel.js";
import type { NewClient } from "../types/types.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export const clientController = {
  /**
   * @description Gets the profile of the authenticated client.
   * @route GET /api/clients/profile
   */
  async getProfile(req: Request, res: Response): Promise<Response> {
    const clientId = req.user?.clientId;

    if (!clientId) {
      throw new BadRequestError("Client ID is required.");
    }
    const client = await clientModel.findById(clientId);
    if (!client) {
      throw new NotFoundError("Client not found.");
    }

    return res.status(200).json(client);
  },

  /**
   * @description Gets all clients.
   * @route GET /api/clients
   */
  async getAllClients(req: Request, res: Response): Promise<Response> {
    const clients = await clientModel.findAll();
    return res.status(200).json(clients);
  },

  /**
   * @description Creates a new client.
   * @route POST /api/clients
   */
  async createClient(req: Request, res: Response): Promise<Response> {
    const { name, settings } = req.body;
    if (!name || !settings) {
      throw new BadRequestError("Name and settings are required.");
    }
    const newClient = await clientModel.create({ name, settings });
    return res.status(201).json(newClient);
  },

  /**
   * @description Updates an existing client.
   * @route PUT /api/clients/:id
   */
  async updateClient(req: Request, res: Response): Promise<Response> {
    const clientId = req.params.id;
    const { name, settings } = req.body;
    if (!clientId) {
      throw new BadRequestError("Client ID is required.");
    }

    const updatedData: Partial<Omit<NewClient, "client_id">> = {}; // Exclude client_id from update

    if (name) updatedData.name = name;
    if (settings) updatedData.settings = settings;

    // Ensure at least one field is provided for update
    if (Object.keys(updatedData).length === 0) {
      throw new BadRequestError("No valid fields to update.");
    }
    const updatedClient = await clientModel.update(clientId, updatedData);
    return res.status(200).json(updatedClient);
  },

  /**
   * @description Deletes a client by their ID.
   * @route DELETE /api/clients/:id
   */
  async deleteClient(req: Request, res: Response): Promise<Response> {
    const clientId = req.params.id;
    if (!clientId) {
      throw new BadRequestError("Client ID is required.");
    }
    const deletedCount = await clientModel.remove(clientId);
    if (deletedCount === 0) {
      throw new NotFoundError("Client not found.");
    }
    return res.sendStatus(204);
  },
};
