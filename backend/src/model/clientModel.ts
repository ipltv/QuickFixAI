// models/clientModel.ts
import db from "../db/db.js";
import type { ClientDB, NewClient } from "../types/index.js";
import type { Knex } from "knex";

const TABLE_NAME = "clients";

export const clientModel = {
  /**
   * Creates a new client.
   * @param clientData - The client data { name, settings }.
   * @returns The created client.
   */
  async create(
    clientData: NewClient,
    trx?: Knex.Transaction
  ): Promise<ClientDB> {
    const [client] = await (db || trx)<ClientDB>(TABLE_NAME)
      .insert(clientData)
      .returning(["id", "name", "settings", "created_at"]);
    return client as ClientDB;
  },

  /**
   * Updates an existing client.
   * @param clientId - The client's UUID.
   * @param clientData - The data to update { name, settings }.
   * @returns - The updated client.
   */
  async update(
    clientId: string,
    clientData: Partial<NewClient>
  ): Promise<ClientDB> {
    const [client] = await db<ClientDB>(TABLE_NAME)
      .where({ id: clientId })
      .update(clientData)
      .returning(["id", "name", "settings", "created_at"]);
    if (!client) {
      throw new Error("Client not found");
    }
    return client as ClientDB;
  },

  /**
   * Deletes a client by their ID.
   * @param id - The client's UUID.
   * @returns The number of deleted rows (0 or 1).
   */
  async remove(id: string): Promise<number> {
    return db<ClientDB>(TABLE_NAME).where({ id }).del();
  },

  /**
   * Finds a client by their name.
   * @param name - The client's name.
   * @returns The found client or undefined.
   */
  async findByName(name: string): Promise<ClientDB | undefined> {
    return db<ClientDB>(TABLE_NAME).where({ name }).first();
  },

  /**
   * Finds a client by their ID.
   * @param id - The client's UUID.
   * @returns The found client or undefined.
   */
  async findById(id: string): Promise<ClientDB | undefined> {
    return db<ClientDB>(TABLE_NAME).where({ id }).first();
  },

  async findAll(): Promise<ClientDB[]> {
    return db<ClientDB>(TABLE_NAME).select([
      "id",
      "name",
      "settings",
      "created_at",
    ]);
  },
};
