import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({
  onClick,
  children,
  variant = "contained",
  disabled = false,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={{
        background: "linear-gradient(90deg,#facc15,#f59e0b)",
        color: "#000",
        fontWeight: "bold",
        px: 3,
        py: 1,
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        "&:hover": {
          background: "linear-gradient(90deg,#fbc31a,#f5a623)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.24)",
        },
        "&:disabled": {
          opacity: 0.6,
          boxShadow: "none",
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
