import type { FunctionComponent } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import {
  STATUSES,
  type TicketStatus,
  type TicketListFilters,
} from "../../../types/index";

interface TicketFiltersProps {
  filters: TicketListFilters;
  onFilterChange: (newFilters: Partial<TicketListFilters>) => void;
}

export const TicketFilters: FunctionComponent<TicketFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    onFilterChange({ status: event.target.value as TicketStatus | "all" });
  };

  return (
    <Box sx={{ mb: 2, width: "100%", maxWidth: "250px" }}>
      <FormControl fullWidth>
        <InputLabel id="status-filter-label">Filter by Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={filters.status}
          label="Filter by Status"
          onChange={handleStatusChange}
          size="small"
        >
          <MenuItem value="all">
            <em>All Statuses</em>
          </MenuItem>
          {Object.values(STATUSES).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
