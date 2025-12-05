import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const GradientTop = styled("div")(({ theme }) => ({
  background: "linear-gradient(90deg,#0ea5b7 0%, #06b6d4 50%, #7c3aed 100%)",
  height: 72,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const NavBar = ({
  userData,
  onToggleSidebar,
  sidebarOpen,
  userRole = "admin",
}) => {
  const getWelcomeText = () => {
    return userRole === "admin" ? "Welcome Admin" : "Welcome Employee";
  };

  return (
    <GradientTop>
      {/* Sidebar Toggle Button */}
      <IconButton
        onClick={onToggleSidebar}
        sx={{
          color: "white",
          display: { md: "none" },
          mr: 2,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {sidebarOpen ? (
          <CloseIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
        ) : (
          <MenuIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
        )}
      </IconButton>

      {/* Logo/Brand */}
      <Typography
        sx={{
          color: "white",
          fontSize: {
            xs: "1.25rem",
            sm: "1.5rem",
            md: "2rem",
            lg: "2.625rem",
          },
          textAlign: "center",
          fontWeight: 600,
          flexGrow: { xs: 1, sm: 0 },
          ml: { xs: 0, md: 2 },
        }}
      >
        Lazy Squad
      </Typography>

      <Box sx={{ flexGrow: { xs: 0, sm: 1 } }} />

      {/* User Welcome Section */}
      <Toolbar
        sx={{
          justifyContent: "flex-end",
          pr: { xs: 1, sm: 2, md: 3 },
          minHeight: "auto !important",
        }}
      >
        <Box
          className="flex items-center gap-2"
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-end", sm: "center" },
            gap: { xs: 0.5, sm: 1, md: 2 },
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "#e6e6e6",
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              "&:hover": {
                bgcolor: "#f0f0f0",
              },
            }}
          >
            <PersonIcon
              sx={{
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                  md: "1.25rem",
                },
              }}
            />
          </IconButton>

          <Typography
            variant="body1"
            sx={{
              color: "white",
              ml: { sm: 1 },
              fontSize: {
                xs: "0.7rem",
                sm: "0.8rem",
                md: "0.875rem",
                lg: "1rem",
              },
              textAlign: { xs: "right", sm: "left" },
              display: { xs: "none", sm: "block" },
            }}
          >
            {getWelcomeText()}
          </Typography>
        </Box>
      </Toolbar>
    </GradientTop>
  );
};

export default NavBar;
