import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RoleBasedRoute } from "./routing/RoleBasedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { TicketsPage } from "./pages/TicketsPage";
import type { Role } from "./types/index";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes within the MainLayout */}
        <Route
          path="/"
          element={
            <RoleBasedRoute
              allowedRoles={[
                "staff",
                "support",
                "client_admin",
                "system_admin",
              ]}
            >
              <MainLayout />
            </RoleBasedRoute>
          }
        >
          {/* Default child route for the layout */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Add placeholders for other protected pages */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="knowledge-base" element={<h1>Knowledge Base Page</h1>} />
          <Route path="users" element={<h1>User Management</h1>} />
          <Route path="clients" element={<h1>Client Management</h1>} />
        </Route>

        {/* Standalone routes */}
        <Route path="/forbidden" element={<h1>403: Forbidden</h1>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
