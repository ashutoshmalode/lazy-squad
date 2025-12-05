import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux-toolkit/Hooks";
import {
  initializeAuth,
  login,
  logout,
} from "../redux-toolkit/slices/AuthSlice";

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
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const loginUser = (userData) => {
    dispatch(login(userData));
    window.history.replaceState(null, "", window.location.href);
  };

  const logoutUser = () => {
    dispatch(logout());
    window.history.replaceState(null, "", "/log-in");
  };

  const value = {
    user,
    login: loginUser,
    logout: logoutUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
