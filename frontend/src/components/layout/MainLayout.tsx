import type { FunctionComponent, ReactNode } from "react";
import { useEffect } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Book as KnowledgeIcon,
  Business as ClientIcon,
  ConfirmationNumber as TicketIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

import { socket } from "../../lib/socket";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ROLES, type Role } from "../../types/index";

const drawerWidth = 240;

// Define navigation items for each role
const navItems: {
  text: string;
  icon: ReactNode;
  path: string;
  roles: Role[];
}[] = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [ROLES.STAFF, ROLES.SUPPORT, ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN],
  },
  {
    text: "Tickets",
    icon: <TicketIcon />,
    path: "/tickets",
    roles: [ROLES.STAFF, ROLES.SUPPORT, ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN],
  },
  {
    text: "Knowledge Base",
    icon: <KnowledgeIcon />,
    path: "/knowledge-base",
    roles: [ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN],
  },
  {
    text: "Users",
    icon: <PeopleIcon />,
    path: "/users",
    roles: [ROLES.CLIENT_ADMIN, ROLES.SYSTEM_ADMIN],
  },
  {
    text: "Clients",
    icon: <ClientIcon />,
    path: "/clients",
    roles: [ROLES.SYSTEM_ADMIN],
  },
];

export const MainLayout: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // --- Global WebSocket Connection Management ---
  useEffect(() => {
    if (accessToken && !socket.connected) {
      socket.connect();
      socket.on("connect", () => {
        console.log("WebSocket actually connected with id:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
      });
    }

    // Disconnect when the user logs out (MainLayout will unmount)
    return () => {
      socket.disconnect();
    };
  }, [accessToken]);
  // --- End of WebSocket Connection Management ---

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userRole = user?.role || ROLES.STAFF; // Default to least privileged role if user is null

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            QuickFixAI
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {user?.name}</Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Log Out">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={RouterLink} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Child routes will be rendered here */}
        <Outlet />
      </Box>
    </Box>
  );
};
