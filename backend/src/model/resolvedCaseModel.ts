// models/resolvedCaseModel.ts
import db from "../db/db.js";
import Knex from "knex";
import type {
  ResolvedCaseDB,
  NewResolvedCase,
  ResolvedCaseUpdateData,
  SearchResult,
} from "../types/types.js";
import { semanticSearchBase } from "../helpers/semanticSearch.js";

const TABLE_NAME = "resolved_cases";

export const resolvedCaseModel = {
  /**
   * Creates a new resolved case.
   * @param data - The data for the resolved case.
   * @returns The created resolved case object.
   */
  async create(
    data: NewResolvedCase,
    trx?: Knex.Knex.Transaction
  ): Promise<ResolvedCaseDB> {
    try {
      const [resolvedCase] = await (trx ?? db)<ResolvedCaseDB>(TABLE_NAME)
        .insert(data)
        .returning("*");
      if (!resolvedCase) throw new Error("Resolved case creation failed.");
      return resolvedCase;
    } catch (error) {
      console.error("Error creating resolved case:", error);
      throw error;
    }
  },

  /**
   * Updates a resolved case.
   * @param id - The UUID of the resolved case to update.
   * @param updates - The data to update.
   * @returns The updated resolved case or undefined if not found.
   */
  async update(
    id: string,
    updates: ResolvedCaseUpdateData
  ): Promise<ResolvedCaseDB | undefined> {
    try {
      const [updated] = await db<ResolvedCaseDB>(TABLE_NAME)
        .where({ id })
        .update(updates)
        .returning("*");
      return updated;
    } catch (error) {
      console.error(`Error updating resolved case with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a resolved case.
   * @param id - The UUID of the resolved case to delete.
   * @returns The number of deleted rows.
   */
  async remove(id: string): Promise<number> {
    try {
      return db<ResolvedCaseDB>(TABLE_NAME).where({ id }).del();
    } catch (error) {
      console.error(`Error deleting resolved case with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finds a resolved case by its ID.
   * @param id - The UUID of the resolved case.
   * @returns The resolved case object or undefined if not found.
   */
  async findById(id: string): Promise<ResolvedCaseDB | undefined> {
    try {
      return db<ResolvedCaseDB>(TABLE_NAME).where({ id }).first();
    } catch (error) {
      console.error(`Error finding resolved case with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Searches for resolved cases by tags using the GIN index.
   * @param clientId - The client's UUID to scope the search.
   * @param tags - An array of tags to search for. Finds cases containing all specified tags.
   * @returns An array of matching resolved cases.
   */
  async searchByTags(
    clientId: string,
    tags: string[]
  ): Promise<ResolvedCaseDB[]> {
    try {
      // The '@>' operator checks if the 'tags' array contains all elements of the provided array.
      return db<ResolvedCaseDB>(TABLE_NAME)
        .where({ client_id: clientId })
        .where("tags", "@>", tags);
    } catch (error) {
      console.error(
        `Error searching resolved cases by tags for client ID ${clientId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Performs a semantic search for similar resolved cases.
   * @param clientId - The client's UUID to scope the search.
   * @param embedding - The search vector.
   * @param limit - The max number of results to return.
   * @returns Found cases with a 'distance' score.
   */
  async semanticSearch(
    clientId: string,
    embedding: number[],
    limit = 1
  ): Promise<SearchResult[]> {
    try {
      return semanticSearchBase(
        TABLE_NAME,
        clientId,
        embedding,
        ["title", "ai_response as content"],
        limit
      );
    } catch (error) {
      console.error(
        `Error performing semantic search for resolved cases for client ID ${clientId}:`,
        error
      );
      throw error;
    }
  },
};
