import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type { Ticket, TicketsState } from "../../types/types";

// Define the shape of the arguments for our async thunk
interface FetchTicketsArgs {
  limit?: number;
  offset?: number;
  status?: string;
}

const initialState: TicketsState = {
  tickets: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch tickets from the API
export const fetchTickets = createAsyncThunk<
  Ticket[], // Return type
  FetchTicketsArgs, // Arguments type
  { rejectValue: string }
>("tickets/fetchTickets", async (args, { rejectWithValue }) => {
  try {
    const response = await axios.get("/tickets", { params: args });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch tickets";
    return rejectWithValue(errorMessage);
  }
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.status = "succeeded";
          state.tickets = action.payload;
        }
      )
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default ticketsSlice.reducer;
