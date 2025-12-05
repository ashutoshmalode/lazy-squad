import React from "react";
import { FormControlLabel, Radio, Box, Typography } from "@mui/material";

const CustomRadio = ({ value, label, color, formStatus, readOnly }) => (
  <FormControlLabel
    value={value}
    control={
      readOnly ? (
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            backgroundColor: formStatus === value ? color : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&::after":
              formStatus === value
                ? {
                    content: '""',
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }
                : {},
          }}
        />
      ) : (
        <Radio
          icon={
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          }
          checkedIcon={
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&::after": {
                  content: '""',
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "white",
                },
              }}
            />
          }
          sx={{
            color: color,
            "&.Mui-checked": {
              color: color,
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        />
      )
    }
    label={
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
    }
    sx={{
      margin: 0,
      padding: "8px 16px",
      borderRadius: "8px",
      border:
        formStatus === value ? `2px solid ${color}` : "2px solid transparent",
      backgroundColor: formStatus === value ? `${color}15` : "transparent",
      transition: "all 0.2s ease",
      "&:hover": readOnly
        ? {}
        : {
            backgroundColor: `${color}10`,
            transform: "translateY(-1px)",
          },
      pointerEvents: readOnly ? "none" : "auto",
    }}
  />
);

export default CustomRadio;
