import type { RequestStatus } from "../misc/requestStatuses";

// --- Frontend Model for a Knowledge Article ---
// Represents the data received from the backend API.
export interface KnowledgeArticle {
  id: string;
  client_id: string;
  title: string;
  content: string;
  tags?: string[];
  embedding: number[];
  created_at: string;
}

// The shape of tha data sending to the server on POST /knowledge endpoint
export interface NewKnowledgeArticlePayload {
  title: string;
  content: string;
  tags?: string[];
}

// The shape of tha data sending to the server on PUT /knowledge/:id endpoint
export interface KnowledgeArticleUpdatePayload {
  title: string;
  content: string;
  tags?: string[];
}

// --- Redux State Shape for the Knowledge Base Feature ---
export interface KnowledgeBaseState {
  articles: KnowledgeArticle[];
  status: RequestStatus;
  error: string | null;
}
