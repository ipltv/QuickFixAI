import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type { Category, CategoryState } from "../../types/index";
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
      });
  },
});

export default categorySlice.reducer;
