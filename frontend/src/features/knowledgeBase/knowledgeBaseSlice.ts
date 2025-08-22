import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import { REQUEST_STATUSES } from "../../types/index";
import type {
  KnowledgeArticle,
  KnowledgeArticleUpdatePayload,
  KnowledgeBaseState,
  NewKnowledgeArticlePayload,
} from "../../types/index";

const initialState: KnowledgeBaseState = {
  articles: [],
  status: REQUEST_STATUSES.IDLE,
  error: null,
};

// --- Async Thunks for CRUD Operations ---

export const fetchArticles = createAsyncThunk<
  KnowledgeArticle[],
  void,
  { rejectValue: string }
>("knowledgeBase/fetchArticles", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/knowledge");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch articles"
    );
  }
});

export const createArticle = createAsyncThunk<
  KnowledgeArticle,
  NewKnowledgeArticlePayload,
  { rejectValue: string }
>("knowledgeBase/createArticle", async (newArticle, { rejectWithValue }) => {
  try {
    const response = await axios.post("/knowledge", newArticle);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create article"
    );
  }
});

export const updateArticle = createAsyncThunk<
  KnowledgeArticle,
  { id: string; data: KnowledgeArticleUpdatePayload },
  { rejectValue: string }
>("knowledgeBase/updateArticle", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/knowledge/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update article"
    );
  }
});

export const deleteArticle = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("knowledgeBase/deleteArticle", async (articleId, { rejectWithValue }) => {
  try {
    await axios.delete(`/knowledge/${articleId}`);
    return articleId; // Return the ID for removal from state
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete article"
    );
  }
});

const knowledgeBaseSlice = createSlice({
  name: "knowledgeBase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchArticles.pending, (state) => {
        state.status = REQUEST_STATUSES.LOADING;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = REQUEST_STATUSES.SUCCEEDED;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = REQUEST_STATUSES.FAILED;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      })
      // Update
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter((a) => a.id !== action.payload);
      });
  },
});

export default knowledgeBaseSlice.reducer;
