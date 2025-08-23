import { useEffect, useState, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../features/tickets/ticketsSlice";
import { TicketList } from "../features/tickets/components/TicketList";
import { TicketFilters } from "../features/tickets/components/TicketFilters";
import { REQUEST_STATUSES, type TicketListFilters } from "../types/index";

const PAGE_LIMIT = 20;

export const TicketsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tickets, status, error } = useAppSelector((state) => state.tickets);
  const { user } = useAppSelector((state) => state.auth);

  // State for filters and pagination
  const [filters, setFilters] = useState<TicketListFilters>({ status: "all" });
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Fetch tickets when the component mounts
    const fetchArgs = {
      limit: PAGE_LIMIT,
      offset,
      ...(filters.status !== "all" && { status: filters.status }),
    };
    dispatch(fetchTickets(fetchArgs));
  }, [filters, offset, dispatch]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<TicketListFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setOffset(0); // Reset to the first page when filters change
  };

  // Handle pagination
  const handleNextPage = () => {
    setOffset((prev) => prev + PAGE_LIMIT);
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - PAGE_LIMIT));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          minWidth: "50vw",
          maxWidth: "1200px",
        }}
      >
        <Typography variant="h4" component="h1">
          Support Tickets
        </Typography>
        <Button variant="contained" onClick={() => navigate("/tickets/new")}>
          Create New Ticket
        </Button>
      </Box>

      {/* Filter component */}
      <TicketFilters filters={filters} onFilterChange={handleFilterChange} />

      {status === REQUEST_STATUSES.LOADING && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <TicketList tickets={tickets} user={user} />
      )}

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="body2" sx={{ mr: 2 }}>
          Page {Math.floor(offset / PAGE_LIMIT) + 1}
        </Typography>
        <IconButton onClick={handlePrevPage} disabled={offset === 0}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleNextPage}
          disabled={tickets.length < PAGE_LIMIT}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
