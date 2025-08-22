import { useEffect, useState, type FunctionComponent } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchEquipment,
  deleteEquipment,
} from "../features/equipment/equipmentSlice";
import { REQUEST_STATUSES, type Equipment } from "../types/index";
import { EquipmentList } from "../features/equipment/components/EquipmentList";
import { EquipmentModal } from "../features/equipment/components/EquipmentModal";

export const EquipmentPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const {
    items: equipment,
    status,
    error,
  } = useAppSelector((state) => state.equipment);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );

  useEffect(() => {
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchEquipment());
    }
  }, [status, dispatch]);

  const handleOpenModal = (item: Equipment | null = null) => {
    setEditingEquipment(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEquipment(null);
  };

  const handleDelete = (equipmentId: string) => {
    if (
      window.confirm("Are you sure you want to delete this piece of equipment?")
    ) {
      dispatch(deleteEquipment(equipmentId));
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
          Equipment Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add New Equipment
        </Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <EquipmentList
          equipment={equipment}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <EquipmentModal
        open={modalOpen}
        onClose={handleCloseModal}
        equipment={editingEquipment}
      />
    </Box>
  );
};
