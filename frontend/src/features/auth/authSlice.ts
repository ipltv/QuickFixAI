//src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types/types.ts";
import type { LoginCredentials } from "../../types/types.ts";
// import * as authApi from '../../api/authApi'; TODO: Uncomment when API is ready

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define the initial state, trying to load token from localStorage
const initialState: AuthState = {
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  status: "idle",
  error: null,
};

/**
 * Async thunk for user login. It handles the async request and dispatches
 * actions based on the request's progress (pending, fulfilled, rejected).
 */

export const loginUser = createAsyncThunk<
  { accessToken: string; user: User },
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    // MOCK API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (credentials.email === "error@ex.com") {
      throw new Error("Invalid credentials");
    }

    const mockResponse = {
      accessToken: "mock-jwt-token-12345",
      user: {
        id: "1",
        email: credentials.email,
        name: "John Doe",
        role: "client_admin" as const,
        clientId: "client123",
      },
    };
    return mockResponse;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to login");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  // Reducers for synchronous actions
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
    },
  },
  // Reducers for async actions created with createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", state.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
