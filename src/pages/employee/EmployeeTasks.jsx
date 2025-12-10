import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import BoxIcon from "@mui/icons-material/Folder";
import { useAuth } from "../../context/AuthContext";
import CustomModal from "../../components/CustomModal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";

// ---------------- STATUS CHIP ----------------
function StatusChip({ status }) {
  if (status === "active")
    return (
      <Chip
        label="Active"
        size="small"
        sx={{ bgcolor: "#06b6d4", color: "#fff" }}
      />
    );
  if (status === "completed")
    return (
      <Chip
        label="Completed"
        size="small"
        sx={{ bgcolor: "#10b981", color: "#fff" }}
      />
    );
  if (status === "failed")
    return (
      <Chip
        label="Failed"
        size="small"
        sx={{ bgcolor: "#ef4444", color: "#fff" }}
      />
    );
  return <Chip label={status} size="small" />;
}

// ---------------- TAB PANEL COMPONENT ----------------
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

// ---------------- MAIN TABLE COMPONENT ----------------
const TaskTable = ({ tasks = [], onRowClick, truncate }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Default truncate function if not provided
  const defaultTruncate = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Use provided truncate function or default
  const truncateFunction = truncate || defaultTruncate;

  // Filter tasks based on selected tab - safely handle undefined tasks
  const filteredTasks = (tasks || []).filter((task) => {
    switch (currentTab) {
      case 0: // Active
        return task.status === "active";
      case 1: // Completed
        return task.status === "completed";
      case 2: // Failed
        return task.status === "failed";
      case 3: // History (all tasks)
        return true;
      default:
        return true;
    }
  });

  return (
    <Card className="shadow-2xl rounded-xl overflow-hidden">
      {/* HEADER WITH TABS */}
      <div
        className="px-4 py-3"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,165,183,0.95), rgba(6,182,212,0.9), rgba(124,58,237,0.9))",
          color: "#fff",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BoxIcon />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              My Tasks
            </Typography>
          </div>

          <div className="text-sm text-white/90">
            Showing: {filteredTasks.length} items
          </div>
        </div>

        {/* TABS */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.875rem",
              fontWeight: 600,
              minWidth: "auto",
              px: 2,
              py: 1,
            },
            "& .Mui-selected": {
              color: "white",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
              height: 3,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab label="Active" />
          <Tab label="Completed" />
          <Tab label="Failed" />
          <Tab label="All Tasks" />
        </Tabs>
      </div>

      {/* TABLE CONTENT */}
      <TabPanel value={currentTab} index={0}>
        <TableContent
          tasks={filteredTasks}
          onRowClick={onRowClick}
          truncate={truncateFunction}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <TableContent
          tasks={filteredTasks}
          onRowClick={onRowClick}
          truncate={truncateFunction}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <TableContent
          tasks={filteredTasks}
          onRowClick={onRowClick}
          truncate={truncateFunction}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <TableContent
          tasks={filteredTasks}
          onRowClick={onRowClick}
          truncate={truncateFunction}
        />
      </TabPanel>
    </Card>
  );
};

// ---------------- TABLE CONTENT COMPONENT ----------------
const TableContent = ({ tasks = [], onRowClick, truncate }) => {
  // Default empty function for onRowClick if not provided
  const handleRowClick = onRowClick || (() => {});

  return (
    <TableContainer component={Paper} className="!shadow-none">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: 60 }}>No</TableCell>
            <TableCell sx={{ fontWeight: 700, width: 160 }}>
              Task Name
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: 120 }}>Task ID</TableCell>
            <TableCell sx={{ fontWeight: 700, width: 230 }}>
              Description
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: 150 }}>
              Assigned To
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: 160 }}>
              Created At
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: 150 }}>
              Sprint / End Date
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: 120 }}>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Sort tasks by createdAt date (newest first) but show sequential numbers */}
          {tasks.map((t, index) => (
            <TableRow
              key={t.id || t.taskId}
              hover
              sx={{
                cursor: "pointer",
                transition: "transform 150ms ease, box-shadow 150ms ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                },
              }}
              onClick={() => handleRowClick(t)}
            >
              {/* Show sequential number starting from 1 */}
              <TableCell>{index + 1}</TableCell>

              <TableCell className="truncate">{truncate(t.name, 20)}</TableCell>

              <TableCell>{t.taskId}</TableCell>

              <TableCell className="truncate">
                {truncate(t.description, 35)}
              </TableCell>

              <TableCell>{t.assignedTo}</TableCell>

              <TableCell>{t.createdAt}</TableCell>

              <TableCell>
                <div>{t.sprint}</div>
                <div className="text-xs text-gray-500">{t.endDate}</div>
              </TableCell>

              <TableCell>
                <StatusChip status={t.status} />
              </TableCell>
            </TableRow>
          ))}

          {/* Empty state */}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No tasks found for this category.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ---------------- MAIN EMPLOYEE TASKS COMPONENT ----------------
export default function EmployeeTasks() {
  const { user } = useAuth();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [debugInfo, setDebugInfo] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const fileInputRef = useRef(null);

  // 🔥 FETCH ALL TASKS DIRECTLY FROM FIRESTORE
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        console.log("📋 Fetching ALL tasks directly from Firestore...");
        const tasksRef = collection(db, "tasks");
        const querySnapshot = await getDocs(tasksRef);

        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`✅ Found ${tasks.length} total tasks`);
        setAllTasks(tasks);

        // Log all tasks for debugging
        tasks.forEach((task, index) => {
          console.log(`Task ${index + 1}:`, {
            id: task.id,
            name: task.name,
            assignedTo: task.assignedTo,
            createdAt: task.createdAt,
          });
        });
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };

    fetchAllTasks();
  }, []);

  // 🔥 FILTER TASKS FOR CURRENT EMPLOYEE
  useEffect(() => {
    if (user && user.name && user.employeeCode && allTasks.length > 0) {
      console.log(
        `🔍 Filtering tasks for employee: ${user.name} (${user.employeeCode})`
      );
      console.log(`📊 Total tasks to filter: ${allTasks.length}`);

      // Create search patterns
      const employeeName = user.name;
      const employeeCode = user.employeeCode;

      // Pattern 1: "LSEMP0001 - Anirudh Malode" (full format)
      const fullPattern = `${employeeCode} - ${employeeName}`;

      // Pattern 2: Just the name part for partial matching
      const nameOnly = employeeName;

      console.log(`🔍 Looking for pattern: "${fullPattern}"`);
      console.log(`🔍 Also checking for name: "${nameOnly}"`);

      // Method 1: Exact match with full pattern
      const exactMatchTasks = allTasks.filter(
        (task) => task.assignedTo === fullPattern
      );

      console.log(
        `✅ Exact match tasks (full pattern): ${exactMatchTasks.length}`
      );

      // Method 2: Contains employee name (case-insensitive)
      const nameMatchTasks = allTasks.filter((task) =>
        task.assignedTo?.toLowerCase().includes(employeeName.toLowerCase())
      );

      console.log(`✅ Name match tasks: ${nameMatchTasks.length}`);

      // Method 3: Contains employee code
      const codeMatchTasks = allTasks.filter((task) =>
        task.assignedTo?.includes(employeeCode)
      );

      console.log(`✅ Code match tasks: ${codeMatchTasks.length}`);

      // Method 4: Show ALL tasks for debugging
      console.log("🔧 ALL TASKS WITH assignedTo VALUES:");
      allTasks.forEach((task, index) => {
        console.log(`   ${index + 1}. "${task.assignedTo}"`);
        console.log(
          `      Contains "${employeeName}"?`,
          task.assignedTo?.toLowerCase().includes(employeeName.toLowerCase())
        );
        console.log(
          `      Contains "${employeeCode}"?`,
          task.assignedTo?.includes(employeeCode)
        );
        console.log(
          `      Equals "${fullPattern}"?`,
          task.assignedTo === fullPattern
        );
      });

      // Use the best match (prefer exact match, then name match, then code match)
      let filteredTasks = exactMatchTasks;

      if (filteredTasks.length === 0 && nameMatchTasks.length > 0) {
        filteredTasks = nameMatchTasks;
        console.log("🔄 Using name match");
      } else if (filteredTasks.length === 0 && codeMatchTasks.length > 0) {
        filteredTasks = codeMatchTasks;
        console.log("🔄 Using code match");
      }

      // Sort tasks by created date (newest first)
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        const dateA = new Date(a.createdAt || "1970-01-01");
        const dateB = new Date(b.createdAt || "1970-01-01");
        return dateB - dateA; // Newest first
      });

      // Add sequential display numbers
      const tasksWithDisplayNumbers = sortedTasks.map((task, index) => ({
        ...task,
        displayNo: index + 1, // Add sequential number starting from 1
      }));

      setEmployeeTasks(tasksWithDisplayNumbers);

      // Set debug info
      setDebugInfo(`
        Employee: ${employeeName}
        Employee Code: ${employeeCode}
        Search Pattern: "${fullPattern}"
        
        Matching Results:
        - Exact pattern match: ${exactMatchTasks.length} tasks
        - Name contains match: ${nameMatchTasks.length} tasks  
        - Code contains match: ${codeMatchTasks.length} tasks
        
        Showing: ${filteredTasks.length} tasks (sorted newest first)
      `);
    }
  }, [user, allTasks]);

  // Handle task click to open modal with task details
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  // Prepare form data for the modal
  const getTaskFormData = (task) => {
    if (!task) return {};

    return {
      name: task.name || "",
      taskId: task.taskId || "",
      description: task.description || "",
      assignedTo: task.assignedTo || "",
      createdAt: task.createdAt || "",
      sprintDays: "7", // Default value for view-only mode
      endDate: task.endDate || "",
      status: task.status || "active",
    };
  };

  // Dummy functions required by CustomModal but not used in view-only mode
  const handleSubmit = () => {};
  const handleInput = () => {};
  const handleFileChange = () => {};

  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Calculate task counts for each category
  const activeTasksCount = employeeTasks.filter(
    (task) => task.status === "active"
  ).length;
  const completedTasksCount = employeeTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const failedTasksCount = employeeTasks.filter(
    (task) => task.status === "failed"
  ).length;
  const totalTasksCount = employeeTasks.length;

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
        My Tasks
      </h1>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Active Tasks</div>
          <div className="text-2xl font-bold text-blue-600">
            {activeTasksCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {completedTasksCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Failed</div>
          <div className="text-2xl font-bold text-red-600">
            {failedTasksCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="text-2xl font-bold text-purple-600">
            {totalTasksCount}
          </div>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={employeeTasks}
        onRowClick={handleTaskClick}
        truncate={truncateText}
      />

      {/* CUSTOM MODAL for Viewing Task Details */}
      <CustomModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode="task"
        editingItem={selectedTask}
        form={getTaskFormData(selectedTask)}
        touched={{}}
        errors={{}}
        formIsValid={true}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onInput={handleInput}
        readOnly={true} // This makes it view-only for employees
      />
    </div>
  );
}
