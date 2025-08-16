// frontend/src/main.tsx
// This is the entry point for the React application.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import setupAxiosInterceptors from "./api/setupInterceptors.ts";

setupAxiosInterceptors(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* The main application component */}
      <App />
    </Provider>
  </StrictMode>
);
