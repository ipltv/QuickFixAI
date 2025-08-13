// models/equipmentModel.ts
import db from "../db/db.js";
import type {
  EquipmentDB,
  NewEquipment,
  EquipmentUpdateData,
} from "../types/types.js";

const TABLE_NAME = "equipment";

export const equipmentModel = {
  /**
   * Creates a new piece of equipment for a client.
   * @param data - The data for the new equipment.
   * @returns The created equipment object.
   */
  async create(data: NewEquipment): Promise<EquipmentDB> {
    try {
      const [equipment] = await db<EquipmentDB>(TABLE_NAME)
        .insert(data)
        .returning("*");
      if (!equipment) throw new Error("Equipment creation failed.");
      return equipment;
    } catch (error) {
      console.error("Error creating equipment:", error);
      throw error;
    }
  },

  /**
   * Finds a piece of equipment by its ID.
   * @param id - The UUID of the equipment.
   * @returns The equipment object or undefined if not found.
   */
  async findById(id: string): Promise<EquipmentDB | undefined> {
    try {
      return db<EquipmentDB>(TABLE_NAME).where({ id }).first();
    } catch (error) {
      console.error(`Error finding equipment with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finds all equipment belonging to a specific client.
   * @param clientId - The client's UUID.
   * @returns An array of equipment objects.
   */
  async findByClientId(clientId: string): Promise<EquipmentDB[]> {
    try {
      return db<EquipmentDB>(TABLE_NAME).where({ client_id: clientId });
    } catch (error) {
      console.error(
        `Error finding equipment for client ID ${clientId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Updates a piece of equipment.
   * @param id - The UUID of the equipment to update.
   * @param updates - An object with the fields to update.
   * @returns The updated equipment object or undefined if not found.
   */
  async update(
    id: string,
    updates: EquipmentUpdateData
  ): Promise<EquipmentDB | undefined> {
    try {
      const [updatedEquipment] = await db<EquipmentDB>(TABLE_NAME)
        .where({ id })
        .update(updates)
        .returning("*");
      return updatedEquipment;
    } catch (error) {
      console.error(`Error updating equipment with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a piece of equipment.
   * @param id - The UUID of the equipment to delete.
   * @returns The number of deleted rows (0 or 1).
   */
  async remove(id: string): Promise<number> {
    try {
      return db<EquipmentDB>(TABLE_NAME).where({ id }).del();
    } catch (error) {
      console.error(`Error deleting equipment with ID ${id}:`, error);
      throw error;
    }
  },
};
