import db from "../db/db.js";
import type { SearchResult } from "../types/index.js";

/**
 * Performs a semantic search on a given table.
 * @param tableName - The table to query.
 * @param clientId - The client's UUID.
 * @param embedding - The search vector.
 * @param selectFields - Fields to select in addition to id and distance.
 * @param limit - Max number of results.
 */
export async function semanticSearchBase(
  tableName: string,
  clientId: string,
  embedding: number[],
  selectFields: string[],
  limit = 5
): Promise<SearchResult[]> {
  const embeddingString = `[${embedding.join(",")}]`;
  const results = await db(tableName)
    .select(
      "id",
      ...selectFields,
      db.raw("embedding <=> ?::vector as distance", [embeddingString])
    )
    .where("client_id", clientId)
    .orderBy("distance", "asc")
    .limit(limit);

  return results as unknown as SearchResult[];
}
