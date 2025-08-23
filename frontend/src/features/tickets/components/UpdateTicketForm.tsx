import type { FunctionComponent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { updateTicketDetails } from "../ticketsSlice";
import {
  STATUSES,
  PRIORITY_LEVELS,
  type Ticket,
  type TicketUpdatePayload,
} from "../../../types/index";

interface UpdateTicketFormProps {
  ticket: Ticket;
}

export const UpdateTicketForm: FunctionComponent<UpdateTicketFormProps> = ({
  ticket,
}) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<TicketUpdatePayload>({
    defaultValues: {
      status: ticket.status,
      priority: ticket.priority,
    },
  });

  const onSubmit: SubmitHandler<TicketUpdatePayload> = (data) => {
    dispatch(updateTicketDetails({ ticketId: ticket.id, data }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="status-select-label" label="Status">
                  {Object.values(STATUSES).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="priority-select-label"
                  label="Priority"
                >
                  {Object.entries(PRIORITY_LEVELS).map(([label, value]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Button type="submit" variant="contained" fullWidth>
            Update
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
