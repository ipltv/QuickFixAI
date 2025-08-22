import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axios';
import type { User, NewUserPayload, UserUpdatePayload, UserState } from '../../types/index';
import { REQUEST_STATUSES } from '../../types/index';

const initialState: UserState = {
  users: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
};

// --- Async Thunks for User CRUD ---

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/users');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk<User, NewUserPayload, { rejectValue: string }>(
  'users/createUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('/users', newUser);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: string; data: UserUpdatePayload }, { rejectValue: string }>(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
