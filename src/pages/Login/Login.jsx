import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../firebase/Auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, "", "/log-in");

    const handlePopState = (event) => {
      window.history.pushState(null, "", "/log-in");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/admin-profile", { replace: true });
      } else {
        navigate("/employee/employee-profile", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    // Check for admin login (keep hardcoded)
    if (email === "ashutoshmalode@lazysquad.com" && password === "LSADM0001") {
      const userData = {
        email: "ashutoshmalode@lazysquad.com",
        name: "Ashutosh Malode",
        role: "admin",
        avatarText: "ADM",
        employeeCode: "LSADM0001",
      };
      login(userData);
      setLoading(false);
      return;
    }

    // For non-admin users, use Firebase authentication
    try {
      const userData = await loginUser(email, password);

      if (userData) {
        // Check if user is an employee (case-insensitive check)
        const userRole = userData.role?.toLowerCase();
        if (userRole === "employee") {
          login(userData);
        } else {
          setError("Access denied. Employee account required.");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/user-not-found") {
        setError(`No employee found with email: ${email}`);
      } else if (error.code === "auth/wrong-password") {
        setError(
          "Incorrect password. Use Employee ID as password (e.g., LSEMP0001)"
        );
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later");
      } else if (error.code === "auth/invalid-credential") {
        setError(
          "Invalid credentials. Please check your email and Employee ID"
        );
      } else if (error.message === "auth/email-already-in-use") {
        setError(
          "Email already exists with different credentials. Please contact admin."
        );
      } else {
        setError("Login failed. Please check your credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (user) {
    return null;
  }

  return (
    <>
      <div className="gradient-bg">
        <Container
          maxWidth="sm"
          className="flex items-center justify-center min-h-screen"
        >
          <Box
            sx={{
              bgcolor: "#3d3d3d",
              height: "60vh",
              width: "60vh",
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "42px",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              Lazy Squad
            </Typography>

            <div className="relative">
              <TextField
                label="Email"
                placeholder="Enter your email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white !important",
                    // Force background color for autofill
                    WebkitTextFillColor: "white !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#cfcfcf",
                    "&.Mui-focused": { color: "white" },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#bbbbbb" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                    // Fix autofill background
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                    "& input:-webkit-autofill:hover": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                    "& input:-webkit-autofill:focus": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                  },
                }}
              />
            </div>

            <div className="relative">
              <TextField
                label="Password (Employee ID)"
                placeholder="Enter your Employee ID"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "#cfcfcf" }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white !important",
                    // Force background color for autofill
                    WebkitTextFillColor: "white !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#cfcfcf",
                    "&.Mui-focused": { color: "white" },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#bbbbbb" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                    // Fix autofill background
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                    "& input:-webkit-autofill:hover": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                    "& input:-webkit-autofill:focus": {
                      WebkitBoxShadow: "0 0 0 1000px #3d3d3d inset !important",
                      WebkitTextFillColor: "white !important",
                    },
                  },
                }}
              />
            </div>

            <Box sx={{ minHeight: "20px" }}>
              {error && (
                <Typography
                  sx={{ color: "red", fontSize: "14px", textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{
                bgcolor: "#47ced4",
                paddingY: "10px",
                fontWeight: "600",
                "&:hover": { bgcolor: "#34a1a6" },
                borderRadius: "10px",
                "&:disabled": {
                  bgcolor: "#cccccc",
                  color: "#666666",
                },
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography sx={{ color: "#cfcfcf", fontSize: "12px", mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Typography sx={{ color: "#bbbbbb", fontSize: "11px" }}>
                Admin: ashutoshmalode@lazysquad.com / LSADM0001
              </Typography>
              <Typography sx={{ color: "#bbbbbb", fontSize: "11px", mt: 0.5 }}>
                Employee: Use exact employee email and Employee ID
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Login;
