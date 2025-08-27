import type { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  Link as MuiLink,
  Paper,
} from "@mui/material";

import { RegistrationForm } from "../features/auth/components/RegistrationForm";

export const RegistrationPage: FunctionComponent = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" gutterBottom>
            Create Your Company Account
          </Typography>
          <RegistrationForm />
          <Typography variant="body1">
            Already have an account?{" "}
            <MuiLink component={RouterLink} to="/login">
              Log in
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
