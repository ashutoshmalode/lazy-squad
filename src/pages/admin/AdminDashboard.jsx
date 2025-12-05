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
import EmployeeManager from "./EmployeeManager";
import AdminProfile from "./AdminProfile";
import TaskManager from "./TaskManager";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Additional protection - ensure only admin can access this dashboard
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/employee/employee-profile", { replace: true });
    }
  }, [user, navigate]);

  // Redirect if not admin
  if (user && user.role !== "admin") {
    return <Navigate to="/employee/employee-profile" replace />;
  }

  // Admin data - use from context
  const adminUserData = {
    name: user?.name || "Ashutosh Malode",
    email: user?.email || "ashutosh@lazysquad.com",
    avatarText: user?.avatarText || "AS",
  };

  // Get current active tab based on route
  const getActiveTab = () => {
    if (location.pathname.includes("/employee-manager")) return "employee";
    if (location.pathname.includes("/task-manager")) return "task";
    return "profile"; // default to profile
  };

  const activeTab = getActiveTab();

  // Admin menu items
  const adminMenuItems = [
    {
      key: "profile",
      path: "/admin/admin-profile",
      icon: "PersonIcon",
      text: "Admin Profile",
      active: activeTab === "profile",
    },
    {
      key: "employee",
      path: "/admin/employee-manager",
      icon: "GroupIcon",
      text: "Employee Manager",
      active: activeTab === "employee",
    },
    {
      key: "task",
      path: "/admin/task-manager",
      icon: "AssignmentIcon",
      text: "Task Manager",
      active: activeTab === "task",
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
          userData={adminUserData}
          menuItems={adminMenuItems}
          onNavigation={handleNavigation}
          userRole="admin"
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
          userData={adminUserData}
          menuItems={adminMenuItems}
          onNavigation={handleNavigation}
          userRole="admin"
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
          userData={adminUserData}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          userRole="admin"
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
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/employee-manager" element={<EmployeeManager />} />
            <Route path="/task-manager" element={<TaskManager />} />
            {/* Redirect to admin-profile for any unmatched admin routes */}
            <Route
              path="*"
              element={<Navigate to="/admin/admin-profile" replace />}
            />
          </Routes>
        </Box>
      </Box>
    </div>
  );
};

export default AdminDashboard;
