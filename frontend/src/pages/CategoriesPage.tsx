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
  fetchCategories,
  deleteCategory,
} from "../features/categories/categorySlice";
import { REQUEST_STATUSES, type Category } from "../types/index";
import { CategoryList } from "../features/categories/components/CategoryList";
import { CategoryModal } from "../features/categories/components/CategoryModal";

export const CategoriesPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const {
    items: categories,
    status,
    error,
  } = useAppSelector((state) => state.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleOpenModal = (item: Category | null = null) => {
    setEditingCategory(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(categoryId));
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
          Ticket Category Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add New Category
        </Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <CategoryList
          categories={categories}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </Box>
  );
};
