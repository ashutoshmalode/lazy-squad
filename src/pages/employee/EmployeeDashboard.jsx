import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import EmployeeProfile from "./EmployeeProfile";
import EmployeeTasks from "./EmployeeTasks";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;

const GradientTop = styled("div")(({ theme }) => ({
  background: "linear-gradient(90deg,#0ea5b7 0%, #06b6d4 50%, #7c3aed 100%)",
  height: 72,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Additional protection - ensure only employee can access this dashboard
  useEffect(() => {
    if (user) {
      const userRole = user.role?.toLowerCase();
      if (userRole !== "employee") {
        navigate("/admin/admin-profile", { replace: true });
      }
    }
  }, [user, navigate]);

  // Redirect if not employee (case-insensitive check)
  if (user) {
    const userRole = user.role?.toLowerCase();
    if (userRole !== "employee") {
      return <Navigate to="/admin/admin-profile" replace />;
    }
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/log-in" replace />;
  }

  // Employee data
  const employeeUserData = {
    name: user?.name || "First User",
    email: user?.email || "user1@lazysquad.com",
    avatarText: user?.avatarText || "FU",
  };

  // Get current active tab based on route
  const getActiveTab = () => {
    if (location.pathname.includes("/employee-tasks")) return "tasks";
    return "profile"; // default to profile
  };

  const activeTab = getActiveTab();

  // Employee menu items (only 2 tabs)
  const employeeMenuItems = [
    {
      key: "profile",
      path: "/employee/employee-profile",
      icon: "PersonIcon",
      text: "Employee Profile",
      active: activeTab === "profile",
    },
    {
      key: "tasks",
      path: "/employee/employee-tasks",
      icon: "AssignmentIcon",
      text: "Tasks",
      active: activeTab === "tasks",
    },
  ];

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close sidebar after navigation
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for Desktop (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0,0,0,0.06)",
            background: "linear-gradient(180deg,#06b6d4 0%, #0369a1 100%)",
            color: "#fff",
          },
        }}
      >
        <SideBar
          userData={employeeUserData}
          menuItems={employeeMenuItems}
          onNavigation={handleNavigation}
          userRole="employee"
        />
      </Drawer>

      {/* Sidebar for Mobile/Tablet (Temporary) */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0,0,0,0.06)",
            background: "linear-gradient(180deg,#06b6d4 0%, #0369a1 100%)",
            color: "#fff",
          },
        }}
      >
        <SideBar
          userData={employeeUserData}
          menuItems={employeeMenuItems}
          onNavigation={handleNavigation}
          userRole="employee"
        />
      </Drawer>

      {/* MAIN CONTENT + NAVBAR */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },
          transition: "width 0.3s ease",
        }}
      >
        {/* NAVBAR */}
        <NavBar
          userData={employeeUserData}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          userRole="employee"
        />

        {/* CONTENT AREA */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 2, sm: 3, md: 4 },
            transition: "margin 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route path="/employee-tasks" element={<EmployeeTasks />} />
            {/* Redirect to employee-profile for any unmatched employee routes */}
            <Route
              path="*"
              element={<Navigate to="/employee/employee-profile" replace />}
            />
          </Routes>
        </Box>
      </Box>
    </div>
  );
};

export default EmployeeDashboard;
