/**
 * Represents the full structure of the 'attachments' table.
 */
export interface AttachmentDB {
  id: string; // UUID
  ticket_id: string;
  client_id: string;
  url?: string;
  filename?: string;
  meta?: Record<string, any>; // JSONB
  created_at: Date;
}

/**
 * Type for creating a new attachment record.
 */
export type NewAttachment = Omit<AttachmentDB, "id" | "created_at">;
/**
 * Type for updating an attachment's metadata.
 */
export type AttachmentUpdateData = Partial<
  Pick<AttachmentDB, "filename" | "meta">
>;
