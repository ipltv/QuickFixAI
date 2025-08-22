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
import { createCategory, updateCategory } from "../categorySlice";
import { fetchClients } from "../../clients/clientSlice";
import {
  type Category,
  type NewCategoryPayload,
  REQUEST_STATUSES,
  ROLES,
} from "../../../types/index";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

const categorySchema = z.object({
  name: z.string().min(3, "Category name is required"),
  client_id: z.uuid().optional().or(z.literal("")), // Allow empty string from form
});

// This type represents the data shape within the form fields
type CategoryFormData = {
  name: string;
  client_id?: string;
};

export const CategoryModal: FunctionComponent<CategoryModalProps> = ({
  open,
  onClose,
  category,
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
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const isEditing = !!category;
  const isSystemAdmin = user?.role === ROLES.SYSTEM_ADMIN;

  useEffect(() => {
    if (isSystemAdmin && open) {
      dispatch(fetchClients());
    }
    if (open) {
      reset({
        name: category?.name || "",
        client_id: category?.client_id || "",
      });
    }
  }, [category, open, reset, isSystemAdmin, dispatch]);

  const onSubmit: SubmitHandler<CategoryFormData> = (data) => {
    const payload = data as NewCategoryPayload;

    if (isSystemAdmin && !isEditing && !payload.client_id) {
      alert("System admin must select a client.");
      return;
    }

    if (isEditing && category) {
      dispatch(updateCategory({ id: category.id, data: payload }));
    } else {
      dispatch(createCategory(payload));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
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
                label="Category Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
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
