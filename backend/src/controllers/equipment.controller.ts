/**
 * @fileoverview This file contains the controller for managing equipment list.
 * It includes methods for creating, reading, updating, and equipment items.
 * It also handles authorization based on user roles.
 */

import type { Request, Response } from "express";
import { equipmentModel } from "../model/equipmentModel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors.js";
import { ROLES } from "../types/index.js";
import type {
  NewEquipment,
  EquipmentUpdateData,
  JwtPayload,
} from "../types/index.js";

export const equipmentController = {
  /**
   * @description Creates a new piece of equipment.
   */
  async createEquipment(req: Request, res: Response): Promise<Response> {
    const { name, type, meta } = req.body;
    const currentUser = req.user as JwtPayload;

    if (!name) {
      throw new BadRequestError("Equipment name is required.");
    }

    // A client_admin can only create equipment for their own client.
    // A system_admin must specify the client_id.
    let client_id = req.body.client_id;
    if (currentUser.role === ROLES.CLIENT_ADMIN) {
      client_id = currentUser.clientId;
    } else if (currentUser.role === ROLES.SYSTEM_ADMIN && !client_id) {
      throw new BadRequestError("client_id is required for system_admin.");
    }

    const newEquipmentData: NewEquipment = {
      client_id,
      name,
      type,
      meta,
    };

    const equipment = await equipmentModel.create(newEquipmentData);
    return res.status(201).json(equipment);
  },

  /**
   * @description Gets all equipment for the user's client.
   */
  async getEquipment(req: Request, res: Response): Promise<Response> {
    const currentUser = req.user as JwtPayload;
    const equipmentList = await equipmentModel.findByClientId(
      currentUser.clientId
    );
    return res.status(200).json(equipmentList);
  },

  /**
   * @description Gets a single piece of equipment by its ID.
   */
  async getEquipmentById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("Equipment ID is required.");
    }

    const equipment = await equipmentModel.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment not found.");
    }

    // Authorization: Ensure user can only access equipment from their own client.
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      equipment.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this resource."
      );
    }

    return res.status(200).json(equipment);
  },

  /**
   * @description Updates a piece of equipment.
   */
  async updateEquipment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("Equipment ID is required.");
    }

    const equipment = await equipmentModel.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment not found.");
    }

    // Authorization check
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      equipment.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to modify this resource."
      );
    }

    const updateData: EquipmentUpdateData = req.body;
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No fields to update provided.");
    }

    const updatedEquipment = await equipmentModel.update(id, updateData);
    return res.status(200).json(updatedEquipment);
  },

  /**
   * @description Deletes a piece of equipment.
   */
  async deleteEquipment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUser = req.user as JwtPayload;

    if (!id) {
      throw new BadRequestError("Equipment ID is required.");
    }

    const equipment = await equipmentModel.findById(id);
    if (!equipment) {
      // Return 204 even if not found to ensure idempotency.
      return res.sendStatus(204);
    }

    // Authorization check
    if (
      currentUser.role !== ROLES.SYSTEM_ADMIN &&
      equipment.client_id !== currentUser.clientId
    ) {
      throw new ForbiddenError(
        "You do not have permission to delete this resource."
      );
    }

    await equipmentModel.remove(id);
    return res.sendStatus(204);
  },
};
