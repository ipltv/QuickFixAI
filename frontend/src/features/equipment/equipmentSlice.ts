import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type { Equipment, EquipmentState } from "../../types/index";
import { REQUEST_STATUSES } from "../../types/index";

const initialState: EquipmentState = {
  items: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
};

export const fetchEquipment = createAsyncThunk<
  Equipment[],
  void,
  { rejectValue: string }
>("equipment/fetchEquipment", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/equipment");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch equipment"
    );
  }
});

const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipment.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.items = action.payload;
      })
      .addCase(fetchEquipment.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      });
  },
});

export default equipmentSlice.reducer;
