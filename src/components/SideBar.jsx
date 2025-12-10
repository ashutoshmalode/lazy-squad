import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SideBar = ({ userData, menuItems, onNavigation, userRole = "admin" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Icon mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case "PersonIcon":
        return <PersonIcon />;
      case "GroupIcon":
        return <GroupIcon />;
      case "AssignmentIcon":
        return <AssignmentIcon />;
      default:
        return <PersonIcon />;
    }
  };

  // Handle logout functionality - FIXED: Use navigate instead of window.location
  const handleLogout = () => {
    logout();
    // AuthContext will handle the navigation
  };

  return (
    <>
      {/* Avatar + Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 60, sm: 72 },
            height: { xs: 60, sm: 72 },
            mb: 2,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: "bold",
          }}
          alt={userData.name}
        >
          {userData.avatarText}
        </Avatar>

        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
            textAlign: "center",
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
          }}
        >
          {userData.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
          }}
        >
          {userData.email}
        </Typography>

        {/* Role Badge */}
        <Box
          sx={{
            mt: 1,
            px: 2,
            py: 0.5,
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {userRole}
        </Box>
      </Box>

      {/* SIDEBAR MENU */}
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              sx={{
                color: "#fff",
                mt: item.key === "profile" ? 4 : 0,
                backgroundColor: item.active
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                py: { xs: 1.25, sm: 1.5, md: 2 },
              }}
              onClick={() => onNavigation(item.path)}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: { xs: 36, sm: 40, md: 56 },
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  },
                }}
              >
                {getIcon(item.icon)}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Log Out Button */}
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              color: "#fff",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              py: { xs: 1.25, sm: 1.5, md: 2 },
            }}
            onClick={handleLogout}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: { xs: 36, sm: 40, md: 56 },
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                },
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log Out"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
        }}
      >
        © Lazy Squad 2025
      </Box>
    </>
  );
};

export default SideBar;
