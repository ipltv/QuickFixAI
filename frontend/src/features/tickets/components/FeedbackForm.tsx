import { useState, type FunctionComponent } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useAppDispatch } from "../../../store/hooks";
import { addFeedbackToAIResponse } from "../ticketsSlice";

interface FeedbackFormProps {
  ticketId: string;
  aiResponseId: string;
}

export const FeedbackForm: FunctionComponent<FeedbackFormProps> = ({
  ticketId,
  aiResponseId,
}) => {
  const dispatch = useAppDispatch();
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedback = (rating: number) => {
    dispatch(
      addFeedbackToAIResponse({
        ticketId,
        ai_response_id: aiResponseId,
        rating,
        comment: rating === 5 ? "Helpful" : "Not helpful",
      })
    );
    setFeedbackSent(true);
  };

  // If feedback has already been sent, display a thank you message
  if (feedbackSent) {
    return (
      <Typography variant="body2" color="text.secondary">
        Thank you for your feedback!
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        Was this helpful?
      </Typography>
      <Tooltip title="Helpful">
        <IconButton onClick={() => handleFeedback(5)} color="primary">
          <ThumbUp />
        </IconButton>
      </Tooltip>
      <Tooltip title="Not Helpful">
        <IconButton onClick={() => handleFeedback(1)} color="secondary">
          <ThumbDown />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
