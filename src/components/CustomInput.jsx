import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CustomInput = ({
  type = "text",
  label,
  value,
  onChange,
  onInput,
  name,
  placeholder,
  disabled = false,
  readOnly = false,
  error = false,
  helperText = "",
  multiline = false,
  rows = 1,
  select = false,
  options = [],
  inputProps = {},
  selectProps = {},
  fullWidth = true,
  required = false,
  autoFocus = false,
  onBlur,
  sx = {},
  ...props
}) => {
  // Common props for all inputs
  const commonProps = {
    label,
    value: value || "",
    disabled,
    error,
    helperText,
    fullWidth,
    required,
    autoFocus,
    sx: {
      ...sx,
      ...(readOnly && {
        "& .MuiInputBase-input": {
          backgroundColor: "#f5f5f5",
          cursor: "default",
        },
      }),
    },
    ...props,
  };

  // Common text field props
  const textFieldProps = {
    ...commonProps,
    placeholder,
    multiline,
    rows,
    InputProps: {
      readOnly,
      ...inputProps,
    },
    onChange: (e) => {
      if (onChange) onChange(e);
      if (onInput && name) onInput(name, e.target.value);
    },
    onBlur,
  };

  // Handle specific input types
  const handleSpecialInput = (value) => {
    if (type === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      return `+91 ${digits}`;
    }
    if (type === "employeeId") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      return `LSEMP${digits}`;
    }
    if (type === "taskId") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      return `TID-${digits}`;
    }
    return value;
  };

  // Get display value based on type
  const displayValue = handleSpecialInput(value || "");

  // Handle change for special input types
  const handleChange = (e) => {
    let newValue = e.target.value;

    if (type === "phone") {
      newValue = newValue.replace("+91 ", "");
      // Only allow digits
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    } else if (type === "employeeId") {
      newValue = newValue.replace("LSEMP", "");
      newValue = newValue.replace(/\D/g, "").slice(0, 4);
    } else if (type === "taskId") {
      newValue = newValue.replace("TID-", "");
      newValue = newValue.replace(/\D/g, "").slice(0, 4);
    } else if (type === "name") {
      // Only allow letters and spaces for names
      newValue = newValue.replace(/[^A-Za-z\s]/g, "");
    }

    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: newValue } });
    }
    if (onInput && name) {
      onInput(name, newValue);
    }
  };

  // Render select input
  if (select) {
    return (
      <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value || ""}
          label={label}
          onChange={handleChange}
          disabled={disabled || readOnly}
          sx={
            readOnly
              ? {
                  "& .MuiSelect-select": {
                    backgroundColor: "#f5f5f5",
                    cursor: "default",
                  },
                }
              : {}
          }
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && helperText && (
          <div style={{ color: "crimson", fontSize: 12, marginTop: 4 }}>
            {helperText}
          </div>
        )}
      </FormControl>
    );
  }

  // Render regular input
  return (
    <TextField
      {...textFieldProps}
      value={displayValue}
      onChange={handleChange}
    />
  );
};

export default CustomInput;
