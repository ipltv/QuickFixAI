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
import { createEquipment, updateEquipment } from "../equipmentSlice";
import type { Equipment, NewEquipmentPayload } from "../../../types/index";

interface EquipmentModalProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
}

const equipmentSchema = z.object({
  name: z.string().min(3, "Equipment name is required"),
  type: z.string().min(3, "Type is required"),
  meta: z.string().transform((str) => JSON.parse(str || "{}")),
});

type EquipmentFormData = { name: string; type: string; meta: string };

export const EquipmentModal: FunctionComponent<EquipmentModalProps> = ({
  open,
  onClose,
  equipment,
}) => {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  const isEditing = !!equipment;

  useEffect(() => {
    if (open) {
      const metaString = equipment?.meta
        ? JSON.stringify(equipment.meta, null, 2)
        : "{}";
      reset({
        name: equipment?.name || "",
        type: equipment?.type || "",
        meta: metaString,
      });
    }
  }, [equipment, open, reset]);

  const onSubmit: SubmitHandler<NewEquipmentPayload> = (data) => {
    if (isEditing && equipment) {
      dispatch(updateEquipment({ id: equipment.id, data }));
    } else {
      dispatch(createEquipment(data));
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
