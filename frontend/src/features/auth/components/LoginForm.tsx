import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer the TypeScript type from the Zod schema
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginForm component handles user input for email and password,
 * validates the input, and handles the submission process.
 */
export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    setError(null);
    console.log("Form Data:", data);

    // --- API CALL PLACEHOLDER ---
    // TODO: Replace with actual API call logic
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
    if (data.email === "error@ex.com") {
      setError("Invalid email or password.");
    } else {
      // On success, redirect the user or update the state.
      console.log("Login successful!");
    }
    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: "100%", marginTop: "16px" }}
    >
      {/* Display server-side error message if it exists */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email Input */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      {/* Password Input */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      {/* Submit Button */}
      <Box sx={{ position: "relative", mt: 3, mb: 2 }}>
        <Button type="submit" fullWidth variant="contained" disabled={loading}>
          Sign In
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};
