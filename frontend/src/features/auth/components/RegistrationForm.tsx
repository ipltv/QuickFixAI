import { useEffect, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Grid,
  Alert,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { registerClientAndOwner } from "../authSlice.js";

import { REQUEST_STATUSES, ROLES } from "../../../types";

const registrationSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  client_name: z.string().min(2, "Company name must be at least 2 characters"),
});

type RegFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      client_name: "",
    },
  });

  const onSubmit: SubmitHandler<RegFormData> = async (data) => {
    dispatch(
      registerClientAndOwner({
        ...data,
        role: ROLES.CLIENT_ADMIN,
        settings: {},
      })
    );
  };

  // Effect to navigate to dashboard on successful client and user creation
  useEffect(() => {
    if (status === REQUEST_STATUSES.SUCCEEDED) {
      navigate("/dashboard");
    }
  }, [status, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 3 }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="client_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Company Name"
                error={!!errors.client_name}
                helperText={errors.client_name?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Your Name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Your Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
        </Grid>
      </Grid>
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
          "Register and Sign In"
        )}
      </Button>
    </Box>
  );
};
