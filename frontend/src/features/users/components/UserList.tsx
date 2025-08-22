import type { FunctionComponent } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import type { User } from "../../../types/index";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserList: FunctionComponent<UserListProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={user.role} size="small" />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(user)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};