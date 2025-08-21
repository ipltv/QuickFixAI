import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import ticketsReducer from "../features/tickets/ticketsSlice";
import categoryReducer from "../features/categories/categorySlice";
import equipmentReducer from "../features/equipment/equipmentSlice";

/**
 * The main Redux store for the application.
 * It combines all the different slice reducers.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    categories: categoryReducer,
    equipment: equipmentReducer,
  },
});

// Types for the RootState and AppDispatch
// These types are used for typing the useSelector and useDispatch hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
