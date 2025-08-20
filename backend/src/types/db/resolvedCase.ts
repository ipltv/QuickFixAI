/**
 * Represents the full structure of the 'resolved_cases' table.
 */
export interface ResolvedCaseDB {
  id: string;
  client_id: string;
  ticket_id: string;
  title: string;
  problem_description: string;
  ai_response: string;
  tags?: string[];
  source: "feedback" | "manual";
  embedding: number[]; // VECTOR(1536)
  created_by?: string;
  created_at: Date;
}

/**
 * Type for creating a new resolved case.
 */
export type NewResolvedCase = Omit<ResolvedCaseDB, "id" | "created_at">;

/**
 * Type for updating a resolved case.
 */
export type ResolvedCaseUpdateData = Partial<
  Omit<ResolvedCaseDB, "id" | "client_id" | "created_at">
>;
