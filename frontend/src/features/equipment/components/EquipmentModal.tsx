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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createEquipment, updateEquipment } from "../equipmentSlice";
import { fetchClients } from "../../clients/clientSlice";
import {
  type Equipment,
  type NewEquipmentPayload,
  REQUEST_STATUSES,
  ROLES,
} from "../../../types/index";

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
}

const equipmentSchema = z.object({
  name: z.string().min(3, "Equipment name is required"),
  type: z.string().min(3, "Type is required"),
  meta: z.string().transform((str) => JSON.parse(str || "{}")),
  client_id: z.uuid().optional().or(z.literal("")),
});

// This type represents the data shape within the form fields (meta is a string)
type EquipmentFormData = {
  name: string;
  type: string;
  meta: string;
  client_id?: string;
};

export const EquipmentModal: FunctionComponent<EquipmentModalProps> = ({
  open,
  onClose,
  equipment,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: clients, status: clientStatus } = useAppSelector(
    (state) => state.clients
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  const isEditing = !!equipment;
  const isSystemAdmin = user?.role === ROLES.SYSTEM_ADMIN;

  useEffect(() => {
    if (isSystemAdmin && open) {
      dispatch(fetchClients());
    }
    if (open) {
      const metaString = equipment?.meta
        ? JSON.stringify(equipment.meta, null, 2)
        : "{}";
      reset({
        name: equipment?.name || "",
        type: equipment?.type || "",
        meta: metaString,
        client_id: equipment?.client_id || "",
      });
    }
  }, [equipment, open, reset, isSystemAdmin, dispatch]);

  const onSubmit: SubmitHandler<EquipmentFormData> = (data) => {
    const payload = data as unknown as NewEquipmentPayload;

    // System admin must select a client when creating
    if (isSystemAdmin && !isEditing && !payload.client_id) {
      alert("System admin must select a client.");
      return;
    }
    // Client admin's client_id is added automatically on the backend

    if (isEditing && equipment) {
      dispatch(updateEquipment({ id: equipment.id, data: payload }));
    } else {
      dispatch(createEquipment(payload));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Equipment" : "Add New Equipment"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Conditionally render Client dropdown for System Admin when creating */}
          {isSystemAdmin && !isEditing && (
            <FormControl fullWidth margin="dense" error={!!errors.client_id}>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="client-select-label"
                    label="Client"
                  >
                    {clientStatus === REQUEST_STATUSES.LOADING ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : (
                      clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
            </FormControl>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Equipment Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Equipment Type (e.g., printer, POS)"
                fullWidth
                error={!!errors.type}
                helperText={errors.type?.message}
              />
            )}
          />
          <Controller
            name="meta"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Meta (JSON)"
                fullWidth
                multiline
                rows={4}
                error={!!errors.meta}
                helperText={errors.meta?.message}
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
