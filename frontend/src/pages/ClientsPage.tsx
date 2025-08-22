import { useEffect, useState, type FunctionComponent } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchClients, deleteClient } from "../features/clients/clientSlice";
import { REQUEST_STATUSES, type Client } from "../types/index";
import { ClientList } from "../features/clients/components/ClientList";
import { ClientModal } from "../features/clients/components/ClientModal";

export const ClientsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const {
    items: clients,
    status,
    error,
  } = useAppSelector((state) => state.clients);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    // Fetch clients only if they haven't been fetched yet
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchClients());
    }
  }, [status, dispatch]);

  const handleOpenModal = (client: Client | null = null) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (clientId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this client? This will also delete all associated users, tickets, and data."
      )
    ) {
      dispatch(deleteClient(clientId));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Client Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add New Client
        </Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <ClientList
          clients={clients}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <ClientModal
        open={modalOpen}
        onClose={handleCloseModal}
        client={editingClient}
      />
    </Box>
  );
};
