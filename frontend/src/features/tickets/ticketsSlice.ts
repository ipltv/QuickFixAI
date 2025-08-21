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
  AIFeedback,
  NewTicketPayload,
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

// Thunk got adding a feedback on AI suggestion
export const addFeedbackToAIResponse = createAsyncThunk<
  AIFeedback, // Return type
  { ticketId: string; ai_response_id: string; rating: number; comment: string },
  { rejectValue: string }
>(
  "tickets/addFeedback",
  async (
    { ticketId, ai_response_id, rating, comment },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/tickets/${ticketId}/feedback`, {
        ai_response_id,
        rating,
        comment,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to post feedback"
      );
    }
  }
);

// Thunk for creating a ticket
export const createTicket = createAsyncThunk<
  Ticket, // Return type: the newly created ticket
  NewTicketPayload, // Arguments: the form data
  { rejectValue: string }
>("tickets/createTicket", async (newTicket, { rejectWithValue }) => {
  try {
    const response = await axios.post("/tickets", newTicket);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create ticket"
    );
  }
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Sync reducer for handling incoming messages
    addMessage: (state, action: PayloadAction<TicketMessage>) => {
      // If there's a selected ticket and the message belongs to it, add it
      if (
        state.selectedTicket &&
        state.selectedTicket.id === action.payload.ticket_id
      ) {
        state.selectedTicket.messages.push(action.payload);
      }
    },
  },
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
      // Cases for adding a message
      .addCase(
        addMessageToTicket.fulfilled,
        (state, action: PayloadAction<TicketMessage>) => {
          // Add the new message to the selected ticket's message list
          if (state.selectedTicket) {
            state.selectedTicket.messages.push(action.payload);
          }
          state.status = REQUEST_STATUSES.SUCCEEDED;
        }
      )
      .addCase(addMessageToTicket.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(addMessageToTicket.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      // Cases for adding a feedback
      .addCase(
        addFeedbackToAIResponse.fulfilled,
        (state, action: PayloadAction<AIFeedback>) => {
          state.status = REQUEST_STATUSES.SUCCEEDED;
          //Nothing to do with response
        }
      )
      .addCase(addFeedbackToAIResponse.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(addFeedbackToAIResponse.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      .addCase(createTicket.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(
        createTicket.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          state.status = REQUEST_STATUSES.SUCCEEDED;
          // Add the new ticket to the beginning of the tickets list
          state.tickets.unshift(action.payload);
        }
      )
      .addCase(createTicket.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage } = ticketsSlice.actions;
export default ticketsSlice.reducer;
