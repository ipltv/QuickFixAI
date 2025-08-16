// frontend/src/App.tsx
// This is the main application component that sets up routing and renders pages.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RoleBasedRoute } from "./routing/RoleBasedRoute";
import type { Role } from "./types/types";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Anyone can access the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Route: Only authenticated users can access the dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute
              allowedRoles={["staff", "admin", "client_admin"] as Role[]}
            >
              <DashboardPage />
            </RoleBasedRoute>
          }
        />

        {/* Redirect root path to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/*  Add a forbidden page for unauthorized access */}
        <Route path="/forbidden" element={<h1>403: Forbidden</h1>} />

        {/* Add a 404 Not Found page */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
