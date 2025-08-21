// Form for creating a new ticket
import { useEffect, type FunctionComponent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../../features/tickets/ticketsSlice";
import { fetchCategories } from "../../../features/categories/categorySlice";
import { fetchEquipment } from "../../../features/equipment/equipmentSlice";
import {
  REQUEST_STATUSES,
  PRIORITY_LEVELS,
  type NewTicketPayload,
} from "../../../types/index";

// Validation schema for the form (Zod)
export const createTicketSchema = z.strictObject({
  category_id: z.uuid({ error: "Please select a category" }),
  subject: z
    .string()
    .min(5, { error: "Subject must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters" }),
  equipment_id: z.uuid({ error: "Please select a equipment" }).optional(),
  priority: z.union([
    z.literal(PRIORITY_LEVELS.Planned),
    z.literal(PRIORITY_LEVELS.Low),
    z.literal(PRIORITY_LEVELS.Medium),
    z.literal(PRIORITY_LEVELS.High),
    z.literal(PRIORITY_LEVELS.Critical),
  ]),
});

export const CreateTicketForm: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Access ticket state (status and error)
  const { status, error } = useAppSelector((state) => state.tickets);

  // Access categories and equipment data from the store
  const { items: categories, status: categoryStatus } = useAppSelector(
    (state) => state.categories
  );
  const { items: equipment, status: equipmentStatus } = useAppSelector(
    (state) => state.equipment
  );

  // Load categories and equipment when the component mounts
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchEquipment());
  }, [dispatch]);

  // Setup form with react-hook-form and Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTicketPayload>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      category_id: "",
      priority: PRIORITY_LEVELS.Medium,
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<NewTicketPayload> = async (data) => {
    const result = await dispatch(createTicket(data));
    // If ticket creation succeeded → redirect to the new ticket page
    if (createTicket.fulfilled.match(result)) {
      const newTicketId = result.payload.id;
      navigate(`/tickets/${newTicketId}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      {/* Error message from the server */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Subject field */}
      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Subject"
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />
        )}
      />

      {/* Description field */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            multiline
            rows={5}
            label="Describe the issue"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      {/* Category select */}
      <FormControl fullWidth margin="normal" error={!!errors.category_id}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select {...field} labelId="category-select-label" label="Category">
              {categoryStatus === REQUEST_STATUSES.LOADING ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              )}
            </Select>
          )}
        />
      </FormControl>

      {/* Equipment select (optional) */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="equipment-select-label">
          Related Equipment (Optional)
        </InputLabel>
        <Controller
          name="equipment_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="equipment-select-label"
              label="Related Equipment (Optional)"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {equipmentStatus === REQUEST_STATUSES.LOADING ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                equipment.map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </MenuItem>
                ))
              )}
            </Select>
          )}
        />
      </FormControl>

      {/* Priority select */}
      <FormControl fullWidth margin="normal" error={!!errors.priority}>
        <InputLabel id="priority-select-label">Priority</InputLabel>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="priority-select-label"
              label="Priority"
              onChange={(e) => field.onChange(Number(e.target.value))}
              value={field.value ?? 3}
            >
              {Object.entries(PRIORITY_LEVELS).map(([label, value]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.priority && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>
            {errors.priority.message}
          </p>
        )}
      </FormControl>

      {/* Submit button with loading indicator */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={status === REQUEST_STATUSES.LOADING}
      >
        {status === REQUEST_STATUSES.LOADING ? (
          <CircularProgress size={24} />
        ) : (
          "Submit Ticket"
        )}
      </Button>
    </Box>
  );
};
