import type { Request, Response } from "express";
import { clientModel } from "../model/clientModel.js";
import type { NewClient } from "../types/types.js";
import { log } from "console";

export const clientController = {
  /**
   * @description Gets the profile of the authenticated client.
   * @route GET /api/clients/profile
   */
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(400).json({ message: "Client ID is required." });
      }
      log("Fetching profile for client ID:", clientId);
      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found." });
      }

      return res.status(200).json(client);
    } catch (error) {
      console.error("Error fetching client profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  /**
   * @description Gets all clients.
   * @route GET /api/clients
   */
  async getAllClients(req: Request, res: Response): Promise<Response> {
    try {
      const clients = await clientModel.findAll();
      return res.status(200).json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  /**
   * @description Creates a new client.
   * @route POST /api/clients
   */
  async createClient(req: Request, res: Response): Promise<Response> {
    try {
      const { name, settings } = req.body;
      if (!name || !settings) {
        return res
          .status(400)
          .json({ message: "Name and settings are required." });
      }
      const newClient = await clientModel.create({ name, settings });
      return res.status(201).json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  /**
   * @description Updates an existing client.
   * @route PUT /api/clients/:id
   */
  async updateClient(req: Request, res: Response): Promise<Response> {
    try {
      const clientId = req.params.id;
      const { name, settings } = req.body;
      if (!clientId) {
        return res.status(400).json({ message: "Client ID is required." });
      }

      const updatedData: Partial<Omit<NewClient, "client_id">> = {}; // Exclude client_id from update

      if (name) updatedData.name = name;
      if (settings) updatedData.settings = settings;

      // Ensure at least one field is provided for update
      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
      const updatedClient = await clientModel.update(clientId, updatedData);
      return res.status(200).json(updatedClient);
    } catch (error) {
      console.error("Error updating client:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  /**
   * @description Deletes a client by their ID.
   * @route DELETE /api/clients/:id
   */
  async deleteClient(req: Request, res: Response): Promise<Response> {
    try {
      const clientId = req.params.id;
      if (!clientId) {
        return res.status(400).json({ message: "Client ID is required." });
      }
      const deletedCount = await clientModel.remove(clientId);
      if (deletedCount === 0) {
        return res.status(404).json({ message: "Client not found." });
      }
      return res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting client:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
