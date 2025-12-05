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
  async (id) => {
    await employeeService.deleteEmployee(id);
    return id;
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
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
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
      // Delete Employee
      .addCase(deleteEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(deleteEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
} = employeeSlice.actions;

export default employeeSlice.reducer;
