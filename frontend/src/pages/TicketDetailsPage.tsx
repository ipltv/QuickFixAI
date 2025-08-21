import { useEffect, type FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTicketById } from "../features/tickets/ticketsSlice";
import { Person as PersonIcon, SmartToy as AiIcon } from "@mui/icons-material";
import { REQUEST_STATUSES } from "../types/index";
import { AddMessageForm } from "../features/tickets/components/AddMessageForm";
import { FeedbackForm } from "../features/tickets/components/FeedbackForm";

export const TicketDetailsPage: FunctionComponent = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const dispatch = useAppDispatch();
  const { selectedTicket, status, error } = useAppSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [ticketId, dispatch]);

  if (status === REQUEST_STATUSES.LOADING && !selectedTicket) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!selectedTicket) {
    return <Typography>No ticket data found.</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Ticket Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedTicket.subject}
        </Typography>
        <Chip label={selectedTicket.status} color="primary" size="small" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Priority: {selectedTicket.priority} | Category:{" "}
          {selectedTicket.category_name}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Message History */}
      <Typography variant="h6" gutterBottom>
        Conversation History
      </Typography>
      <List>
        {selectedTicket.messages.map((message) => (
          <>
            <ListItem key={message.id} alignItems="flex-start" divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      message.author_type === "ai"
                        ? "secondary.main"
                        : "primary.main",
                  }}
                >
                  {message.author_type === "ai" ? <AiIcon /> : <PersonIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  message.author_type === "ai"
                    ? "AI Assistant"
                    : `User: {${message.author_id}}`
                } //TODO: Replace with name
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ whiteSpace: "pre-wrap" }} // Preserve newlines
                  >
                    {message.content}
                  </Typography>
                }
              />
            </ListItem>
            {/* Conditionally render the feedback form for AI messages */}
            {ticketId &&
              message.author_type === "ai" &&
              message.ai_response_id && (
                <Box sx={{ pl: 7, mb: 2 }}>
                  <FeedbackForm
                    ticketId={ticketId}
                    aiResponseId={message.ai_response_id}
                  />
                </Box>
              )}
          </>
        ))}
      </List>

      {/* Add New Message Form */}
      {ticketId && <AddMessageForm ticketId={ticketId} />}
    </Paper>
  );
};
