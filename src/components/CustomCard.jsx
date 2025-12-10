import React from "react";
import { Avatar, Typography, Card, CardContent } from "@mui/material";

const CustomCard = ({ employee, onClick }) => {
  // Don't render if employee is null/undefined
  if (!employee) return null;

  return (
    <Card
      className="cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
      sx={{
        borderRadius: 3,
        boxShadow:
          "0px 10px 25px rgba(2,6,23,0.06), 0px 4px 8px rgba(0,0,0,0.06)",
        "&:hover": {
          boxShadow:
            "0px 18px 40px rgba(2,6,23,0.12), 0px 8px 18px rgba(0,0,0,0.1)",
        },
      }}
      onClick={() => {
        if (employee && employee.id) {
          onClick(employee);
        }
      }}
    >
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar
            sx={{
              bgcolor: employee.avatarColor || "#888",
              width: 56,
              height: 56,
            }}
            src={employee.avatarDataUrl || undefined}
          >
            {!employee.avatarDataUrl &&
              employee.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
          </Avatar>

          <div>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {employee.name || "Unknown Employee"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee.designation || "No Designation"} •{" "}
              {employee.employeeCode || employee.id || "No ID"}
            </Typography>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Mobile</span>
            <span className="font-medium">{employee.phone || "N/A"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
