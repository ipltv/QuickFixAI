import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type {
  Category,
  CategoryState,
  NewCategoryPayload,
  CategoryUpdatePayload,
} from "../../types/index";
import { REQUEST_STATUSES } from "../../types/index";

const initialState: CategoryState = {
  items: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[], // Return type
  void, // No arguments
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/categories");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
});

export const createCategory = createAsyncThunk<
  Category,
  NewCategoryPayload,
  { rejectValue: string }
>("categories/createCategory", async (newCategory, { rejectWithValue }) => {
  try {
    const response = await axios.post("/categories", newCategory);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create category"
    );
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: CategoryUpdatePayload },
  { rejectValue: string }
>("categories/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/categories/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update category"
    );
  }
});

export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("categories/deleteCategory", async (categoryId, { rejectWithValue }) => {
  try {
    await axios.delete(`/categories/${categoryId}`);
    return categoryId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete category"
    );
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
