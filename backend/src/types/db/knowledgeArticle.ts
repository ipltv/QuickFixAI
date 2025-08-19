/**
 * Represents the full structure of the 'knowledge_articles' table.
 */
export interface KnowledgeArticleDB {
  id: string; // UUID
  client_id: string;
  title: string;
  content: string;
  tags?: string[]; // TEXT[]
  embedding: number[]; // VECTOR(1536)
  created_at: Date;
}

/**
 * Type for creating a new knowledge article, based on the full DB entity.
 */
export type NewKnowledgeArticle = Omit<KnowledgeArticleDB, "id" | "created_at">;

/**
 * Type for the update payload. Only specific fields should be updatable.
 */
export type KnowledgeArticleUpdateData = Partial<
  Pick<KnowledgeArticleDB, "title" | "content" | "tags" | "embedding">
>;

/**
 * Type for search results, which includes the distance metric.
 */
export type SearchResult = Pick<
  KnowledgeArticleDB,
  "id" | "title" | "content" | "tags"
> & {
  distance: number;
};
