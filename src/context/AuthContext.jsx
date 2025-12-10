import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAppDispatch, useAppSelector } from "../redux-toolkit/Hooks";
import {
  initializeAuth,
  login,
  logout,
} from "../redux-toolkit/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const loginUser = useCallback(
    (userData) => {
      dispatch(login(userData));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    // Navigate to login page WITHOUT reloading
    navigate("/log-in", { replace: true });
  }, [dispatch, navigate]);

  const value = {
    user,
    login: loginUser,
    logout: logoutUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
