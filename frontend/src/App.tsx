import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RoleBasedRoute } from "./routing/RoleBasedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { TicketsPage } from "./pages/TicketsPage";
import { ROLES } from "./types/index";
import "./App.css";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";

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
                ROLES.STAFF,
                ROLES.SUPPORT,
                ROLES.CLIENT_ADMIN,
                ROLES.SYSTEM_ADMIN,
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
          <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
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
