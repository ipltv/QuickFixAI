import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RoleBasedRoute } from "./routing/RoleBasedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { TicketsPage } from "./pages/TicketsPage";
import { ROLES } from "./types/index";
import "./App.css";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage";
import { ClientsPage } from "./pages/ClientsPage";
import { UsersPage } from "./pages/UsersPage";
import { EquipmentPage } from "./pages/EquipmentPage";

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

          {/* Other protected pages */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/new" element={<CreateTicketPage />} />
          <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
          {/* Knowledge Base */}
          <Route
            path="knowledge-base"
            element={
              <RoleBasedRoute
                allowedRoles={[ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN]}
              >
                <KnowledgeBasePage />
              </RoleBasedRoute>
            }
          />
          {/* Equipment Management */}
          <Route
            path="equipment"
            element={
              <RoleBasedRoute
                allowedRoles={[ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN]}
              >
                <EquipmentPage />
              </RoleBasedRoute>
            }
          />
          {/* User Management */}
          <Route
            path="users"
            element={
              <RoleBasedRoute
                allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.CLIENT_ADMIN]}
              >
                <UsersPage />
              </RoleBasedRoute>
            }
          />
          {/* Client Management */}
          <Route
            path="clients"
            element={
              <RoleBasedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                <ClientsPage />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Standalone routes */}
        <Route path="/forbidden" element={<h1>403: Forbidden</h1>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
