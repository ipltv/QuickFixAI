// --- Frontend Model for AI Feedback ---
// Represents the data received from the backend API.
export interface AIFeedback {
    id: string;
    ai_response_id: string;
    ticket_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
}
