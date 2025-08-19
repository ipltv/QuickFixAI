/**
 * Represents the full structure of the 'ticket_categories' table.
 */
export interface CategoryDB {
  id: string;
  client_id: string;
  name: string;
  created_at: Date;
}

/**
 * Type for creating a new ticket category.
 */
export type NewCategory = Omit<CategoryDB, "id" | "created_at">;

/**
 * Type for updating a ticket category.
 */
export type CategoryUpdateData = Partial<
  Omit<CategoryDB, "id" | "client_id" | "created_at">
>;