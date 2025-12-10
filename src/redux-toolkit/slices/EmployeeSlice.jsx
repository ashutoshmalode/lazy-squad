import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeService } from "../../firebase/firebaseService";

// 🔥 FIREBASE ASYNC THUNKS
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    return await employeeService.getEmployees();
  }
);

export const addEmployeeAsync = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData) => {
    return await employeeService.addEmployee(employeeData);
  }
);

export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }) => {
    return await employeeService.updateEmployee(id, employeeData);
  }
);

export const deleteEmployeeAsync = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error) {
      // Don't throw error for "not found" errors during deletion
      if (
        error.message.includes("not found") ||
        error.message.includes("Not found")
      ) {
        return id; // Still return the id so it can be removed from state
      }
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    search: "",
    form: {
      avatarDataUrl: null,
      avatarColor: "#888",
      name: "",
      email: "",
      phoneDigits: "",
      dob: "",
      bloodGroup: "",
      department: "",
      role: "",
      employeeCodeDigits: "",
      designation: "",
      workingProject: "",
      joiningDate: "",
      location: "",
      workFormat: "",
      position: "",
    },
    touched: {},
    editingEmployee: null,
    loading: false,
    initialLoad: true, // NEW: Track initial load separately
    error: null,
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = {
        avatarDataUrl: null,
        avatarColor: "#888",
        name: "",
        email: "",
        phoneDigits: "",
        dob: "",
        bloodGroup: "",
        department: "",
        role: "",
        employeeCodeDigits: "",
        designation: "",
        workingProject: "",
        joiningDate: "",
        location: "",
        workFormat: "",
        position: "",
      };
    },
    setTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },
    resetTouched: (state) => {
      state.touched = {};
    },
    setEditingEmployee: (state, action) => {
      state.editingEmployee = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialLoadComplete: (state) => {
      state.initialLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoad = false; // Mark initial load as complete
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.initialLoad = false; // Mark initial load as complete even if error
        state.error = action.error.message;
      })
      // Add Employee
      .addCase(addEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(addEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Employee
      .addCase(updateEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Employee - FIXED: Handle "not found" errors gracefully
      .addCase(deleteEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; // Clear any errors
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(deleteEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        // Only set error if it's not a "not found" error
        if (
          !action.payload?.includes("not found") &&
          !action.payload?.includes("Not found")
        ) {
          state.error = action.payload || action.error.message;
        } else {
          // If it's a "not found" error, still remove the employee from state
          const employeeId = action.meta.arg;
          state.employees = state.employees.filter(
            (emp) => emp.id !== employeeId
          );
          state.error = null; // Don't show error for "not found" during deletion
        }
      });
  },
});

export const {
  setEmployees,
  setSearch,
  setForm,
  resetForm,
  setTouched,
  resetTouched,
  setEditingEmployee,
  clearError,
  setInitialLoadComplete,
} = employeeSlice.actions;

export default employeeSlice.reducer;
