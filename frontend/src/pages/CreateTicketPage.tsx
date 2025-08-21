import type { FunctionComponent } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import { CreateTicketForm } from "../features/tickets/components/CreateTicketForm";

export const CreateTicketPage: FunctionComponent = () => {
  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Create a New Support Ticket
        </Typography>
        <CreateTicketForm />
      </Paper>
    </Container>
  );
};
