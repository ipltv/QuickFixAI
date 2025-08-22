import { useEffect, type FunctionComponent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { createClient, updateClient } from "../clientSlice";
import type { Client, NewClientPayload } from "../../../types/index";

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}

// Zod schema for form validation
const clientSchema = z.object({
  name: z.string().min(3, "Client name must be at least 3 characters"),
  // Handle settings as a string and transform it to a JSON object
  settings: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON format" });
      return z.NEVER;
    }
  }),
});

// This type is for the form's internal state (settings is a string)
type ClientFormData = {
  name: string;
  settings: string;
};

export const ClientModal: FunctionComponent<ClientModalProps> = ({
  open,
  onClose,
  client,
}) => {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", settings: "{}" },
  });

  const isEditing = !!client;

  useEffect(() => {
    if (open) {
      // When editing, stringify the settings object for the form field
      const settingsString = client?.settings
        ? JSON.stringify(client.settings, null, 2)
        : "{}";
      reset({ name: client?.name || "", settings: settingsString });
    }
  }, [client, open, reset]);

  // The data here is the transformed data from the Zod schema (settings is an object)
  const onSubmit: SubmitHandler<NewClientPayload> = (data) => {
    if (isEditing && client) {
      dispatch(updateClient({ id: client.id, data }));
    } else {
      dispatch(createClient(data));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Client" : "Create New Client"}
      </DialogTitle>
      {/* The handleSubmit function will now correctly receive the validated data */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                required
                margin="dense"
                label="Client Name"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="settings"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Settings (JSON)"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                error={!!errors.settings}
                helperText={errors.settings?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditing ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
