// models/clientModel.ts
import db from "../db/db.js";
import { type ClientDB } from "../types/types.js";

// Type for creating a new entity, derived from the main DB interface.
type NewClient = Omit<ClientDB, "id" | "created_at">;

const TABLE_NAME = "clients";

export const clientModel = {
  /**
   * Creates a new client.
   * @param clientData - The client data { name, settings }.
   * @returns The created client.
   */
  async create(clientData: NewClient): Promise<ClientDB> {
    const [client] = await db<ClientDB>(TABLE_NAME)
      .insert(clientData)
      .returning(["id", "name", "settings", "created_at"]);
    return client as ClientDB;
  },

  /**
   * Finds a client by their ID.
   * @param id - The client's UUID.
   * @returns The found client or undefined.
   */
  async findById(id: string): Promise<ClientDB | undefined> {
    return db<ClientDB>(TABLE_NAME).where({ id }).first();
  },
};
