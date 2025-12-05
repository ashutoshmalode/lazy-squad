import { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (
      email === "ashutoshmalode@lazysquad.com" &&
      password === "AshutoshMalodeLSADM0001"
    ) {
      const userData = {
        email: "ashutosh@lazysquad.com",
        name: "Ashutosh Malode",
        role: "admin",
        avatarText: "ADM",
      };
      login(userData);
    } else if (
      email === "employee@lazysquad.com" &&
      password === "employee123"
    ) {
      const userData = {
        email: "employee@lazysquad.com",
        name: "First User",
        role: "employee",
        avatarText: "EMP",
      };
      login(userData);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
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

            <TextField
              label="Email"
              placeholder="Enter your email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                input: { color: "white" },
                label: { color: "#cfcfcf" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#bbbbbb" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />

            <TextField
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                input: { color: "white" },
                label: { color: "#cfcfcf" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#bbbbbb" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />

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
              sx={{
                bgcolor: "#47ced4",
                paddingY: "10px",
                fontWeight: "600",
                "&:hover": { bgcolor: "#34a1a6" },
                borderRadius: "10px",
              }}
            >
              Log In
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography sx={{ color: "#cfcfcf", fontSize: "12px", mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Typography sx={{ color: "#bbbbbb", fontSize: "11px" }}>
                Admin: ashutoshmalode@lazysquad.com / AshutoshMalodeLSADM0001
              </Typography>
              <Typography sx={{ color: "#bbbbbb", fontSize: "11px" }}>
                Employee: employee@lazysquad.com / employee123
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Login;
