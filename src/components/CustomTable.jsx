import React from "react";
import {
  Card,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import BoxIcon from "@mui/icons-material/Folder";

// ---------------- STATUS CHIP ----------------
function StatusChip({ status }) {
  if (status === "active")
    return (
      <Chip
        label="Active"
        size="small"
        sx={{ bgcolor: "#06b6d4", color: "#fff" }}
      />
    );
  if (status === "completed")
    return (
      <Chip
        label="Completed"
        size="small"
        sx={{ bgcolor: "#10b981", color: "#fff" }}
      />
    );
  if (status === "failed")
    return (
      <Chip
        label="Failed"
        size="small"
        sx={{ bgcolor: "#ef4444", color: "#fff" }}
      />
    );
  return <Chip label={status} size="small" />;
}

// ---------------- MAIN TABLE COMPONENT ----------------
const CustomTable = ({ tasks, onRowClick, truncate }) => {
  return (
    <Card className="shadow-2xl rounded-xl overflow-hidden">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,165,183,0.95), rgba(6,182,212,0.9), rgba(124,58,237,0.9))",
          color: "#fff",
        }}
      >
        <div className="flex items-center gap-3">
          <BoxIcon />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
            Tasks Table
          </Typography>
        </div>

        <div className="text-sm text-white/90">
          Showing: {tasks.length} items
        </div>
      </div>

      <TableContainer component={Paper} className="!shadow-none">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 60 }}>No</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 160 }}>
                Task Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>
                Task ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 230 }}>
                Description
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 150 }}>
                Assigned To
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 160 }}>
                Created At
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 150 }}>
                Sprint / End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((t) => (
              <TableRow
                key={t.taskId}
                hover
                sx={{
                  cursor: "pointer",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                  },
                }}
                onClick={() => onRowClick(t)}
              >
                <TableCell>{t.no}</TableCell>

                <TableCell className="truncate">
                  {truncate(t.name, 20)}
                </TableCell>

                <TableCell>{t.taskId}</TableCell>

                <TableCell className="truncate">
                  {truncate(t.description, 35)}
                </TableCell>

                <TableCell>{t.assignedTo}</TableCell>

                <TableCell>{t.createdAt}</TableCell>

                <TableCell>
                  <div>{t.sprint}</div>
                  <div className="text-xs text-gray-500">{t.endDate}</div>
                </TableCell>

                <TableCell>
                  <StatusChip status={t.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default CustomTable;
