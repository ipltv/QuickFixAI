import { Fragment, useEffect, type FunctionComponent } from "react";

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
  Skeleton,
} from "@mui/material";
import { Person as PersonIcon, SmartToy as AiIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { socket } from "../lib/socket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { REQUEST_STATUSES, type TicketMessage } from "../types/index";
import { AddMessageForm } from "../features/tickets/components/AddMessageForm";
import { FeedbackForm } from "../features/tickets/components/FeedbackForm";
import { addMessage, fetchTicketById } from "../features/tickets/ticketsSlice";

export const TicketDetailsPage: FunctionComponent = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const dispatch = useAppDispatch();
  const { selectedTicket, status, error } = useAppSelector(
    (state) => state.tickets
  );
  // if (
  //   ticketId &&
  //   (selectedTicket?.id !== ticketId ||
  //     selectedTicket?.messages.some((m) => m.id.includes("placeholder")))
  // ) {
  useEffect(() => {
    // Only fetch if the selected ticket isn't the one user need, or if it has placeholders and need update it
    if (ticketId && selectedTicket?.id !== ticketId) {
      dispatch(fetchTicketById(ticketId));
    }
    // --- WebSocket Logic ---

    // Join the room for this specific ticket
    socket.emit("joinTicketRoom", ticketId);
    // Set up the listener for new messages
    const handleNewMessage = (message: TicketMessage) => {
      // Dispatch the action to add the new message to the Redux store
      dispatch(addMessage(message));
    };
    socket.on("newMessage", handleNewMessage);

    // Clean up when the component unmounts
    return () => {
      socket.emit("leaveTicketRoom", ticketId);
      socket.off("newMessage", handleNewMessage);
    };
    // --- End of WebSocket Logic ---
  }, [ticketId, dispatch, selectedTicket]);

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
        {selectedTicket.messages.map((message) =>
          // Check for the placeholder ID
          message.id === "ai-placeholder" ? (
            <ListItem key="ai-placeholder" alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <AiIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="AI Assistant"
                secondary={<Skeleton animation="wave" width="80%" />}
              />
            </ListItem>
          ) : (
            <Fragment key={message.id}>
              <ListItem alignItems="flex-start" divider>
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
                      : `${message.author_name ?? "Unknown"}`
                  }
                  slotProps={{
                    primary: {
                      fontWeight: "bold",
                    },
                  }}
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
            </Fragment>
          )
        )}
      </List>

      {/* Add New Message Form */}
      {ticketId && <AddMessageForm ticketId={ticketId} />}
    </Paper>
  );
};
