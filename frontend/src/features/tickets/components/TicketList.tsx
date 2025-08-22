import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import type { Ticket, User } from "../../../types/index.ts";
import { STATUSES, ROLES } from "../../../types/index.ts";
import { useNavigate } from "react-router-dom";

interface TicketListProps {
  tickets: Ticket[];
  user: User | null;
}

const getStatusChipColor = (status: string) => {
  switch (status) {
    case STATUSES.OPEN:
      return "primary";
    case STATUSES.IN_PROGRESS:
      return "warning";
    case STATUSES.RESOLVED:
      return "success";
    case STATUSES.ESCALATED:
      return "error";
    default:
      return "default";
  }
};

export const TicketList: React.FC<TicketListProps> = ({ tickets, user }) => {
  const navigate = useNavigate();

  const handleRowClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (tickets.length === 0) {
    return <Typography>No tickets found.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {user && user.role === ROLES.SYSTEM_ADMIN && (
              <TableCell sx={{ fontWeight: "bold" }}>Client</TableCell>
            )}
            <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: 180 }}>
              Last Updated
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              hover
              onClick={() => handleRowClick(ticket.id)}
              sx={{
                cursor: "pointer",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              {user && user.role === ROLES.SYSTEM_ADMIN && (
                <TableCell>{ticket.client_id}</TableCell>
              )}
              <TableCell component="th" scope="row">
                {ticket.subject}
              </TableCell>
              <TableCell>
                {(ticket.creator_name ?? ticket.created_by) || "N/A"}
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.status}
                  color={getStatusChipColor(ticket.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>
                {new Date(ticket.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
