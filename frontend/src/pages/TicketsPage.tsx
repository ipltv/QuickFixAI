import { useEffect, type FunctionComponent } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../features/tickets/ticketsSlice";
import { TicketList } from "../features/tickets/components/TicketList";
import { REQUEST_STATUSES } from "../types/index";

export const TicketsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { tickets, status, error } = useAppSelector((state) => state.tickets);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch tickets when the component mounts
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchTickets({ limit: 20 }));
    }
  }, [status, dispatch]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Support Tickets
        </Typography>
        <Button variant="contained">Create New Ticket</Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && <TicketList tickets={tickets} user={user} />}
    </Box>
  );
};
