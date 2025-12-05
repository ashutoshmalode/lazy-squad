import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../../firebase/firebaseService";

// 🔥 FIREBASE ASYNC THUNKS
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await taskService.getTasks();
});

export const fetchEmployeeTasks = createAsyncThunk(
  "tasks/fetchEmployeeTasks",
  async (employeeId) => {
    return await taskService.getTasksByEmployee(employeeId);
  }
);

export const addTaskAsync = createAsyncThunk(
  "tasks/addTask",
  async (taskData) => {
    return await taskService.addTask(taskData);
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }) => {
    return await taskService.updateTask(id, taskData);
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await taskService.deleteTask(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    search: "",
    activeTab: "active",
    form: {
      name: "",
      taskId: "",
      description: "",
      assignedTo: "",
      createdAt: "",
      sprintDays: "",
      endDate: "",
      status: "active",
    },
    touched: {},
    editingTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = {
        name: "",
        taskId: "",
        description: "",
        assignedTo: "",
        createdAt: "",
        sprintDays: "",
        endDate: "",
        status: "active",
      };
    },
    setTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },
    resetTouched: (state) => {
      state.touched = {};
    },
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Employee Tasks
      .addCase(fetchEmployeeTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setTasks,
  setSearch,
  setActiveTab,
  setForm,
  resetForm,
  setTouched,
  resetTouched,
  setEditingTask,
  clearError,
} = taskSlice.actions;

export default taskSlice.reducer;
