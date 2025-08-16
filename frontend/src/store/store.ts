import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

/**
 * The main Redux store for the application.
 * It combines all the different slice reducers.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // other reducers here
  },
});

// Types for the RootState and AppDispatch
// These types are used for typing the useSelector and useDispatch hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
