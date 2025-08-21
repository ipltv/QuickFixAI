//src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import type { User, Role, AuthState } from "../../types/index.ts";
import type { LoginCredentials } from "../../types/index.ts";
import api from "../../lib/axios";
import { jwtDecode } from "jwt-decode";
// Helper function to decode user from token
const getUserFromToken = (token: string): User | null => {
  try {
    const decoded: {
      id: string;
      email: string;
      name: string;
      role: Role;
      clientId: string;
    } = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      clientId: decoded.clientId,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Define the initial state, trying to load token from localStorage
const initialState: AuthState = {
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  status: "idle",
  error: null,
};
if (initialState.accessToken) {
  initialState.user = getUserFromToken(initialState.accessToken);
}
/**
 * Async thunk for user login. It handles the async request and dispatches
 * actions based on the request's progress (pending, fulfilled, rejected).
 */

export const loginUser = createAsyncThunk<
  { accessToken: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<{ accessToken: string }>(
      "/auth/login",
      credentials
    );
    return { accessToken: data.accessToken };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to login");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to logout";
      return rejectWithValue(errorMsg);
    }
  }
);

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
    // Action to set the access token and decode user information
    // This is used AXIOS interceptors to update the token in the store
    setAccessToken: (state, action: { payload: string }) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
      state.user = getUserFromToken(action.payload);
    },
  },
  // Reducers for async actions created with createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
        localStorage.removeItem("accessToken");
      })
      .addMatcher(isAnyOf(loginUser.pending, logoutUser.pending), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(isAnyOf(loginUser.fulfilled), (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.user = getUserFromToken(action.payload.accessToken);
        localStorage.setItem("accessToken", state.accessToken);
      })
      .addMatcher(
        isAnyOf(loginUser.rejected, logoutUser.rejected),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
          state.user = null;
          state.accessToken = null;
          localStorage.removeItem("accessToken");
        }
      );
  },
});

export const { logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
