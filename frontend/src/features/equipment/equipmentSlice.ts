import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type {
  Equipment,
  EquipmentState,
  NewEquipmentPayload,
  EquipmentUpdatePayload,
} from "../../types/index";
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

export const createEquipment = createAsyncThunk<
  Equipment,
  NewEquipmentPayload,
  { rejectValue: string }
>("equipment/createEquipment", async (newEquipment, { rejectWithValue }) => {
  try {
    const response = await axios.post("/equipment", newEquipment);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create equipment"
    );
  }
});

export const updateEquipment = createAsyncThunk<
  Equipment,
  { id: string; data: EquipmentUpdatePayload },
  { rejectValue: string }
>("equipment/updateEquipment", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/equipment/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update equipment"
    );
  }
});

export const deleteEquipment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("equipment/deleteEquipment", async (equipmentId, { rejectWithValue }) => {
  try {
    await axios.delete(`/equipment/${equipmentId}`);
    return equipmentId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete equipment"
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
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default equipmentSlice.reducer;
