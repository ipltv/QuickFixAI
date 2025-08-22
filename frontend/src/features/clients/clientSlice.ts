import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import {
  REQUEST_STATUSES,
  type Client,
  type ClientState,
} from "../../types/index";

const initialState: ClientState = {
  items: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
};

export const fetchClients = createAsyncThunk<
  Client[],
  void,
  { rejectValue: string }
>("clients/fetchClients", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/clients");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch clients"
    );
  }
});

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      });
  },
});

export default clientSlice.reducer;
