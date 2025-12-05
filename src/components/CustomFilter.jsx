import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const CustomFilter = ({
  value,
  onChange,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <div className="mb-6">
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-500" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          },
        }}
        {...props}
      />
    </div>
  );
};

export default CustomFilter;
