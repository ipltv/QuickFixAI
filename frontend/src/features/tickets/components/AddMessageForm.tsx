import { useState, type FunctionComponent } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addMessageToTicket } from "../ticketsSlice";
import { REQUEST_STATUSES } from "../../../types";

// Props interface for AddMessageForm
interface AddMessageFormProps {
  ticketId: string; // ID of the ticket to add a message to
}

export const AddMessageForm: FunctionComponent<AddMessageFormProps> = ({
  ticketId,
}) => {
  // State for the message content
  const [content, setContent] = useState("");
  // Redux dispatch hook
  const dispatch = useAppDispatch();
  // Get ticket status from Redux store
  const { status } = useAppSelector((state) => state.tickets);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // Dispatch action if content is not empty
    if (content.trim()) {
      dispatch(addMessageToTicket({ ticketId, content }));
      setContent(""); // Clear the input field
    }
  };

  return (
    // Form for adding a new message
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      {/* Text field for message content */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Add a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
      />
      {/* Button to send the reply */}
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        // Disable button if content is empty or status is loading
        disabled={!content.trim() || status === REQUEST_STATUSES.LOADING}
      >
        {/* Show CircularProgress when loading, otherwise show "Send Reply" */}
        {status === REQUEST_STATUSES.LOADING ? (
          <CircularProgress size={24} />
        ) : (
          "Send Reply"
        )}
      </Button>
    </Box>
  );
};
