/**
 * Represents the full structure of the 'equipment' table.
 */
export interface EquipmentDB {
  id: string;
  client_id: string;
  name: string;
  type?: string;
  meta: Record<string, any>;
  created_at: Date;
}

/**
 * Type for creating new equipment..
 */
export type NewEquipment = Omit<EquipmentDB, "id" | "created_at">;

/**
 * Type for updating equipment.
 */
export type EquipmentUpdateData = Partial<
  Omit<EquipmentDB, "id" | "client_id" | "created_at">
>;
