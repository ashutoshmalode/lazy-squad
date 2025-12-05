import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux-toolkit/Store.jsx";
import Login from "./pages/Login/Login.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TestFirebase from "./components/TestFirebase"; // Import the test component

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          {/* Add TestFirebase component here - it will show on all pages */}
          {/* <TestFirebase /> */}

          <Routes>
            <Route path="/log-in" element={<Login />} />

            {/* Protected Admin Routes - Only accessible by admin users */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Employee Routes - Only accessible by employee users */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect root path to login page */}
            <Route path="/" element={<Navigate to="/log-in" replace />} />

            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/log-in" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
