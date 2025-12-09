import React, { useMemo, useRef, useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux-toolkit/Hooks";
import {
  setSearch,
  setActiveTab,
  setForm,
  setTouched,
  setEditingTask,
  resetForm,
  resetTouched,
  fetchTasks,
  addTaskAsync,
  updateTaskAsync,
} from "../../redux-toolkit/slices/taskSlice";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";
import CustomTable from "../../components/CustomTable";
import CustomModal from "../../components/CustomModal";
import CustomButton from "../../components/CustomButton";
import CustomFilter from "../../components/CustomFilter";

// 🔥 TEXT TRIMMER
const truncate = (text, max) =>
  text.length > max ? text.substring(0, max) + "…" : text;

// ---------------- TAB CARD ----------------
function TabCard({ title, count, icon, active = false, gradient, onClick }) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`min-w-[170px] cursor-pointer transform transition-all duration-200 ${
        active ? "scale-105" : "scale-100"
      }`}
    >
      <div
        className="rounded-xl p-4 shadow-xl hover:shadow-2xl transition-shadow"
        style={{
          background: active
            ? gradient
            : "linear-gradient(180deg,#ffffff,#f8fafc)",
          color: active ? "#fff" : "#111827",
          border: active ? "none" : "1px solid rgba(15,23,42,0.05)",
          minWidth: "200px",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap=3">
            <div className="p-2 mx-2 rounded-lg bg-white/20">{icon}</div>
            <div>
              <div
                className={`text-sm font-semibold ${
                  active ? "text-white" : "text-gray-700"
                }`}
              >
                {title}
              </div>
              <div
                className={`text-xs ${
                  active ? "text-white/90" : "text-gray-500"
                }`}
              >
                {count} tasks
              </div>
            </div>
          </div>

          <div
            className={`text-2xl font-bold ${
              active ? "text-white" : "text-gray-300"
            }`}
          >
            {count}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
export default function TaskManager() {
  const dispatch = useAppDispatch();
  const {
    tasks,
    search,
    activeTab,
    form,
    touched,
    editingTask,
    loading,
    error,
  } = useAppSelector((state) => state.tasks);
  const { employees } = useAppSelector((state) => state.employees);
  const [modalOpen, setModalOpen] = React.useState(false);
  const fileInputRef = useRef(null);

  // 🔥 FETCH TASKS ON COMPONENT MOUNT
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Check if task ID already exists
  const isTaskIdExists = (taskId) => {
    const fullTaskId = `TID-${taskId}`;
    return tasks.some((task) => task.taskId === fullTaskId);
  };

  // 🔍 SEARCH + FILTER
  const filtered = useMemo(() => {
    let list =
      activeTab === "history"
        ? tasks
        : tasks.filter((t) => t.status === activeTab);

    if (!search.trim()) return list;

    return list.filter((t) => {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.taskId.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.sprint.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      );
    });
  }, [activeTab, search, tasks]);

  // Calculate end date based on created at and sprint days
  const calculateEndDate = (createdAt, sprintDays) => {
    if (!createdAt || !sprintDays) return "";

    const createdDate = new Date(createdAt);
    if (isNaN(createdDate.getTime())) return "";

    const endDate = new Date(createdDate);
    endDate.setDate(endDate.getDate() + parseInt(sprintDays));

    return endDate.toISOString().split("T")[0];
  };

  // Generate next task number and ID
  const getNextTaskInfo = () => {
    const maxNo = Math.max(...tasks.map((t) => t.no), 0);
    const nextNo = maxNo + 1;
    const nextTaskId = String(nextNo).padStart(4, "0");
    return { nextNo, nextTaskId };
  };

  // Check if there are employees available
  const hasEmployees = employees.length > 0;

  // Open modal for adding new task
  const handleOpenAdd = () => {
    if (!hasEmployees) return;

    dispatch(setEditingTask(null));
    dispatch(resetForm());
    dispatch(resetTouched());
    setModalOpen(true);
  };

  // Open modal for editing task
  const handleOpenEdit = (task) => {
    dispatch(setEditingTask(task));
    dispatch(
      setForm({
        name: task.name || "",
        taskId: (task.taskId || "").replace("TID-", ""),
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        createdAt: task.createdAt || "",
        sprintDays: "7",
        endDate: task.endDate || "",
        status: task.status || "active",
      })
    );
    dispatch(resetTouched());
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    dispatch(setEditingTask(null));
    dispatch(resetForm());
  };

  const handleInput = (key, value) => {
    let newForm = { ...form, [key]: value };

    // Auto-calculate end date when createdAt or sprintDays changes
    if (key === "createdAt" || key === "sprintDays") {
      if (newForm.createdAt && newForm.sprintDays) {
        newForm.endDate = calculateEndDate(
          newForm.createdAt,
          newForm.sprintDays
        );
      } else {
        newForm.endDate = "";
      }
    }

    dispatch(setForm(newForm));
    dispatch(setTouched({ [key]: true }));
  };

  // Form validation for tasks
  const errors = {
    name: !form.name || !form.name.trim(),
    taskId:
      !form.taskId ||
      form.taskId.length !== 4 ||
      (editingTask === null && isTaskIdExists(form.taskId)),
    description: !form.description || !form.description.trim(),
    assignedTo: !form.assignedTo || !form.assignedTo.trim(),
    createdAt: !form.createdAt || !form.createdAt.trim(),
    sprintDays: !form.sprintDays,
    endDate: !form.endDate || !form.endDate.trim(),
    status: !form.status || !form.status.trim(),
  };

  const formIsValid = Object.values(errors).every((v) => v === false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(errors).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    dispatch(setTouched(allTouched));

    if (!formIsValid) return;

    if (editingTask === null) {
      const { nextNo, nextTaskId } = getNextTaskInfo();

      // In TaskManager.jsx handleSubmit function, ensure:
      const newTask = {
        no: nextNo,
        name: form.name,
        taskId: `TID-${form.taskId || nextTaskId}`,
        description: form.description,
        assignedTo: form.assignedTo, // This should be the EXACT employee name
        createdAt: form.createdAt,
        sprint: `Sprint ${Math.floor(nextNo / 5) + 5}`,
        endDate: form.endDate,
        status: form.status,
      };

      // 🔥 FIREBASE: ADD TASK
      dispatch(addTaskAsync(newTask));
      dispatch(setActiveTab(form.status));
    } else {
      const updatedTask = {
        ...editingTask,
        name: form.name,
        description: form.description,
        assignedTo: form.assignedTo,
        createdAt: form.createdAt,
        endDate: form.endDate,
        status: form.status,
      };

      // 🔥 FIREBASE: UPDATE TASK
      dispatch(
        updateTaskAsync({
          id: editingTask.id,
          taskData: updatedTask,
        })
      );
      dispatch(setActiveTab(form.status));
    }

    setModalOpen(false);
    dispatch(resetForm());
  };

  // File change handler for tasks (not used but required by CustomModal)
  const handleFileChange = () => {};

  // Calculate counts for tabs
  const activeCount = tasks.filter((t) => t.status === "active").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const failedCount = tasks.filter((t) => t.status === "failed").length;
  const historyCount = tasks.length;

  return (
    <Box sx={{ p: 6, width: "100%" }}>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Task Manager
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Typography variant="body2" color="primary">
            Loading tasks...
          </Typography>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Typography variant="body2" color="error">
            Error: {error}
          </Typography>
        </div>
      )}

      {/* TABS + BUTTON */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex gap-4 flex-wrap">
          <TabCard
            title="Active Tasks"
            count={activeCount}
            icon={<HourglassTopIcon fontSize="small" />}
            active={activeTab === "active"}
            onClick={() => dispatch(setActiveTab("active"))}
            gradient="linear-gradient(90deg,#06b6d4,#7c3aed)"
          />

          <TabCard
            title="Completed"
            count={completedCount}
            icon={<TaskAltIcon fontSize="small" />}
            active={activeTab === "completed"}
            onClick={() => dispatch(setActiveTab("completed"))}
            gradient="linear-gradient(90deg,#00c853,#00e5ff)"
          />

          <TabCard
            title="Failed"
            count={failedCount}
            icon={<CancelIcon fontSize="small" />}
            active={activeTab === "failed"}
            onClick={() => dispatch(setActiveTab("failed"))}
            gradient="linear-gradient(90deg,#ff6b6b,#ff8f00)"
          />

          <TabCard
            title="History"
            count={historyCount}
            icon={<HistoryIcon fontSize="small" />}
            active={activeTab === "history"}
            onClick={() => dispatch(setActiveTab("history"))}
            gradient="linear-gradient(90deg,#4b5563,#9ca3af)"
          />
        </div>

        <CustomButton onClick={handleOpenAdd} disabled={!hasEmployees}>
          {hasEmployees ? "Add New Task" : "No Employees Available"}
        </CustomButton>
      </div>

      {!hasEmployees && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Typography variant="body2" color="text.secondary">
            You need to add employees first before creating tasks.
          </Typography>
        </div>
      )}

      {/* Custom Filter */}
      <CustomFilter
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search tasks by name, ID, description, assigned person..."
      />

      {/* TABLE */}
      <CustomTable
        tasks={filtered}
        onRowClick={handleOpenEdit}
        truncate={truncate}
      />

      {/* CUSTOM MODAL for Tasks */}
      <CustomModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        mode="task"
        editingItem={editingTask}
        form={form}
        touched={touched}
        errors={errors}
        formIsValid={formIsValid}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onInput={handleInput}
        employees={employees}
        readOnly={false} // Admin mode - editable
      />
    </Box>
  );
}
