import { useEffect, useState, type FunctionComponent } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers, deleteUser } from "../features/users/userSlice";
import { REQUEST_STATUSES, type User } from "../types/index";
import { UserList } from "../features/users/components/UserList";
import { UserModal } from "../features/users/components/UserModal";

export const UsersPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector((state) => state.users);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
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
          User Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add New User
        </Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <UserList
          users={users}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <UserModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={editingUser}
      />
    </Box>
  );
};
