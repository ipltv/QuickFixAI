import {
  Container,
  Box,
  Typography,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { LoginForm } from "../features/auth/components/LoginForm.tsx";
import { Link as RouterLink } from "react-router-dom";

/**
 * LoginPage is a page component responsible for rendering the login form.
 * It centers the form on the screen and provides a title.
 * All the login form logic is encapsulated within the LoginForm component.
 */
export const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Use Paper to create a "card" for the form */}
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            QuickFixAI Login
          </Typography>
          <LoginForm />
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don't have an account?{" "}
            <MuiLink component={RouterLink} to="/register">
              Sign Up
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
