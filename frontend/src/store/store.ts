import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import ticketsReducer from "../features/tickets/ticketsSlice";
import categoryReducer from "../features/categories/categorySlice";
import equipmentReducer from "../features/equipment/equipmentSlice";
import knowledgeReducer from "../features/knowledgeBase/knowledgeBaseSlice";
import clientReducer from "../features/clients/clientSlice";
import userReducer from "../features/users/userSlice";

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
    knowledgeBase: knowledgeReducer,
    clients: clientReducer,
    users: userReducer,
  },
});

// Types for the RootState and AppDispatch
// These types are used for typing the useSelector and useDispatch hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
