/**
 * Represents the full structure of the 'clients' table.
 */
export interface ClientDB {
  id: string; // UUID
  name: string;
  settings: Record<string, any>; // JSONB
  created_at: Date;
}

/**
 * Type for creating a new client, based on the full DB entity.
 */
export type NewClient = Omit<ClientDB, "id" | "created_at">;
