import React from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  People as PeopleIcon,
  Book as KnowledgeIcon,
  Business as ClientIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';
import type { Role } from '../../types/types';

const drawerWidth = 240;

// Define navigation items for each role
const navItems: { text: string; icon: React.ReactNode; path: string; roles: Role[] }[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['staff', 'support', 'client_admin', 'system_admin'] },
  { text: 'Tickets', icon: <TicketIcon />, path: '/tickets', roles: ['staff', 'support', 'client_admin', 'system_admin'] },
  { text: 'Knowledge Base', icon: <KnowledgeIcon />, path: '/knowledge-base', roles: ['client_admin', 'system_admin'] },
  { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['client_admin', 'system_admin'] },
  { text: 'Clients', icon: <ClientIcon />, path: '/clients', roles: ['system_admin'] },
];

export const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userRole = user?.role || 'staff'; // Default to least privileged role if user is null

  return (
    <Box sx={{ display: 'flex' }}>
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems
              .filter(item => item.roles.includes(userRole))
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
