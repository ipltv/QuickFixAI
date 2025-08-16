import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || "User"}!
      </Typography>
      <Typography>
        This is your dashboard. You can only see this page because you are
        logged in.
      </Typography>
      <Typography>
        Your role is: <strong>{user?.role}</strong>
      </Typography>
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 4 }}>
        Log Out
      </Button>
    </Box>
  );
};
