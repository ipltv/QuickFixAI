import type { ReactNode, FunctionComponent } from "react";
import { Outlet, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  People as PeopleIcon,
  Book as KnowledgeIcon,
  Business as ClientIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import type { Role } from "../../types/index";
import { ROLES } from "../../types/index";

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
  const { user } = useAppSelector((state) => state.auth);

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
