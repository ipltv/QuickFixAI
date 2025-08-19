import db from "../db/db.js";
import type {
  CategoryDB,
  NewCategory,
  CategoryUpdateData,
} from "../types/index.js";

const TABLE_NAME = "ticket_categories";

export const categoryModel = {
  /**
   * Creates a new category for a client.
   */
  async create(data: NewCategory): Promise<CategoryDB> {
    const [category] = await db<CategoryDB>(TABLE_NAME)
      .insert(data)
      .returning(["id", "client_id", "name", "created_at"]);
    if (!category) throw new Error("Category creation failed.");
    return category;
  },

  /**
   * Updates a category.
   */
  async update(
    id: string,
    updates: CategoryUpdateData
  ): Promise<CategoryDB | undefined> {
    const [updatedCategory] = await db<CategoryDB>(TABLE_NAME)
      .where({ id })
      .update(updates)
      .returning(["id", "client_id", "name", "created_at"]);
    return updatedCategory;
  },

  /**
   * Deletes a category.
   */
  async remove(id: string): Promise<number> {
    return db<CategoryDB>(TABLE_NAME).where({ id }).del();
  },

  /**
   * Finds a category by its ID.
   */
  async findById(id: string): Promise<CategoryDB | undefined> {
    return db<CategoryDB>(TABLE_NAME).where({ id }).first();
  },

  /**
   * Finds all categories for a specific client.
   */
  async findByClientId(clientId: string): Promise<CategoryDB[]> {
    return db<CategoryDB>(TABLE_NAME)
      .where({ client_id: clientId })
      .orderBy("name", "asc");
  },
};
