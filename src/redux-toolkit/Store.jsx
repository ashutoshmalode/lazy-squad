import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import employeeReducer from "./slices/EmployeeSlice";
import taskReducer from "./slices/TaskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    tasks: taskReducer,
  },
});

export default store;
