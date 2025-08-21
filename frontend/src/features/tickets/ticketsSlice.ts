import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type {
  Ticket,
  TicketsState,
  TicketWithMessages,
  TicketMessage,
} from "../../types/index.ts";
import { REQUEST_STATUSES } from "../../types/index.ts";

// Define the shape of the arguments for our async thunk
interface FetchTicketsArgs {
  limit?: number;
  offset?: number;
  status?: string;
}

const initialState: TicketsState = {
  tickets: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
  selectedTicket: null,
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

// Thunk to fetch a single ticket by its ID
export const fetchTicketById = createAsyncThunk<
  TicketWithMessages, // Return type
  string, // Argument: ticketId
  { rejectValue: string }
>("tickets/fetchTicketById", async (ticketId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch ticket details"
    );
  }
});

// Thunk for adding a message
export const addMessageToTicket = createAsyncThunk<
  TicketMessage, // Return type
  { ticketId: string; content: string }, // Arguments
  { rejectValue: string }
>("tickets/addMessage", async ({ ticketId, content }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/tickets/${ticketId}/messages`, {
      content,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to post message"
    );
  }
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetching the list of tickets
      .addCase(fetchTickets.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
        state.error = null;
      })
      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.status = REQUEST_STATUSES.SUCCEEDED;
          state.tickets = action.payload;
        }
      )
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      // Cases for fetching a single ticket
      .addCase(fetchTicketById.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      // Case for adding a message
      .addCase(
        addMessageToTicket.fulfilled,
        (state, action: PayloadAction<TicketMessage>) => {
          // Add the new message to the selected ticket's message list
          if (state.selectedTicket) {
            state.selectedTicket.messages.push(action.payload);
          }
        }
      )
      .addCase(addMessageToTicket.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(addMessageToTicket.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      });
  },
});

export default ticketsSlice.reducer;
