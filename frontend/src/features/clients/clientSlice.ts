import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import {
  REQUEST_STATUSES,
  type Client,
  type ClientState,
  type NewClientPayload,
  type ClientUpdatePayload,
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

export const createClient = createAsyncThunk<
  Client,
  NewClientPayload,
  { rejectValue: string }
>("clients/createClient", async (newClient, { rejectWithValue }) => {
  try {
    const response = await axios.post("/clients", newClient);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create client"
    );
  }
});

export const updateClient = createAsyncThunk<
  Client,
  { id: string; data: ClientUpdatePayload },
  { rejectValue: string }
>("clients/updateClient", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/clients/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update client"
    );
  }
});

export const deleteClient = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("clients/deleteClient", async (clientId, { rejectWithValue }) => {
  try {
    await axios.delete(`/clients/${clientId}`);
    return clientId; // Return the ID for removal from state
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete client"
    );
  }
});

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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
      })
      // Create
      .addCase(createClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default clientSlice.reducer;
