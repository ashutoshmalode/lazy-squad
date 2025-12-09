import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Button,
  Avatar,
  Box,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomInput from "./CustomInput";
import CustomRadio from "./CustomRadio";

const CustomModal = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  mode,
  editingItem,
  form,
  touched,
  errors,
  formIsValid,
  fileInputRef,
  onFileChange,
  onInput,
  nextEmployeeCodeDigits,
  employees = [],
  readOnly = false,
  generatedCredentials,
}) => {
  const isEmployeeMode = mode === "employee";
  const isEditing = editingItem !== null;
  const isViewOnly = readOnly;

  // Function to capitalize first letter of each word
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (isViewOnly) return; // Don't submit in view-only mode

    // Auto-capitalize name before submission
    if (isEmployeeMode && form.name) {
      onInput("name", capitalizeName(form.name));
    }

    // Auto-generate employee code if empty and adding new employee
    if (isEmployeeMode && !isEditing && !form.employeeCodeDigits) {
      const generatedCode = nextEmployeeCodeDigits();
      onInput("employeeCodeDigits", generatedCode);

      setTimeout(() => {
        onSubmit(e);
      }, 0);
      return;
    }

    onSubmit(e);
  };

  // For createdAt - use EXACT same DatePicker as original modal
  const handleCreatedAtChange = (newValue) => {
    if (isViewOnly) return;

    if (newValue) {
      // Use ISO string format for createdAt
      const formattedDate = newValue.toISOString().slice(0, 16);
      onInput("createdAt", formattedDate);
    } else {
      onInput("createdAt", "");
    }
  };

  // For DOB - use same DatePicker as Add New Task modal
  const handleDOBChange = (newValue) => {
    if (isViewOnly) return;

    if (newValue) {
      // Format to dd/mm/yyyy string
      const day = String(newValue.getDate()).padStart(2, "0");
      const month = String(newValue.getMonth() + 1).padStart(2, "0");
      const year = newValue.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      onInput("dob", formattedDate);
    } else {
      onInput("dob", "");
    }
  };

  // For Joining Date - use same DatePicker as Add New Task modal
  const handleJoiningDateChange = (newValue) => {
    if (isViewOnly) return;

    if (newValue) {
      // Format to dd/mm/yyyy string
      const day = String(newValue.getDate()).padStart(2, "0");
      const month = String(newValue.getMonth() + 1).padStart(2, "0");
      const year = newValue.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      onInput("joiningDate", formattedDate);
    } else {
      onInput("joiningDate", "");
    }
  };

  // For End Date - handle the date change
  const handleEndDateChange = (newValue) => {
    if (isViewOnly) return;

    if (newValue) {
      // Format to dd/mm/yyyy string
      const day = String(newValue.getDate()).padStart(2, "0");
      const month = String(newValue.getMonth() + 1).padStart(2, "0");
      const year = newValue.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      onInput("endDate", formattedDate);
    } else {
      onInput("endDate", "");
    }
  };

  const handleRadioChange = (event) => {
    if (isViewOnly) return;
    onInput("status", event.target.value);
  };

  const handleDeleteClick = () => {
    if (isViewOnly) return;
    if (onDelete) {
      onDelete();
    }
  };

  const getTitle = () => {
    if (isViewOnly) {
      if (isEmployeeMode) {
        return "Employee Details";
      } else {
        return "Task Details";
      }
    }

    if (isEmployeeMode) {
      return isEditing ? "Edit Employee" : "Add New Employee";
    } else {
      return isEditing ? "Edit Task" : "Add New Task";
    }
  };

  const getSubmitButtonText = () => {
    if (isViewOnly) return "Close";

    if (isEmployeeMode) {
      return isEditing ? "Update" : "Submit";
    } else {
      return isEditing ? "Update Task" : "Assign Task";
    }
  };

  // Common text field props for read-only mode
  const textFieldProps = isViewOnly
    ? {
        InputProps: {
          readOnly: true,
        },
        sx: {
          "& .MuiInputBase-input": {
            backgroundColor: "#f5f5f5",
            cursor: "default",
          },
        },
      }
    : {};

  // Common date picker props for read-only mode
  const datePickerProps = isViewOnly
    ? {
        disabled: true,
        readOnly: true,
      }
    : {};

  // Parse date string to Date object for DatePicker
  const parseDateString = (dateString) => {
    if (!dateString || dateString === "") return null;

    try {
      // Handle dd/mm/yyyy format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        // Month is 0-indexed in JavaScript Date
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Handle other formats if needed
      return new Date(dateString);
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  // Blood group options
  const bloodGroupOptions = [
    { value: "A", label: "A" },
    { value: "A+", label: "A+" },
    { value: "B", label: "B" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  // Marital status options
  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  // Nationality options
  const nationalityOptions = [
    { value: "Indian", label: "Indian" },
    { value: "American", label: "American" },
    { value: "British", label: "British" },
    { value: "Canadian", label: "Canadian" },
    { value: "Australian", label: "Australian" },
    { value: "Other", label: "Other" },
  ];

  // Work format options
  const workFormatOptions = [
    { value: "Remote", label: "Remote" },
    { value: "In-Office", label: "In-Office" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  // Task status options
  const taskStatusOptions = [
    { value: "active", label: "Active", color: "#06b6d4" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "failed", label: "Failed", color: "#ef4444" },
  ];

  // Employee options for task assignment
  const employeeOptions = employees.map((employee) => ({
    value: `${employee.employeeCode} - ${employee.name}`,
    label: `${employee.employeeCode} - ${employee.name}`,
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        disableRestoreFocus
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(2px)",
          },
        }}
        slotProps={{
          backdrop: {
            style: { pointerEvents: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isViewOnly
              ? "linear-gradient(90deg,#6b7280 0%, #4b5563 100%)"
              : "linear-gradient(180deg,#06b6d4 0%, #0369a1 100%)",
            color: "white",
            fontWeight: 700,
          }}
        >
          {getTitle()}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#111",
              "&:focus": {
                outline: "2px solid #06b6d4",
                outlineOffset: "2px",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ background: "#fafafa" }}>
          <Box component="form" noValidate onSubmit={handleSubmitForm}>
            <Grid container spacing={2}>
              {/* Employee-specific: Avatar Section */}
              {isEmployeeMode && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={form.avatarDataUrl || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 1,
                        bgcolor: form.avatarColor,
                      }}
                    >
                      {!form.avatarDataUrl &&
                        (form.name || "NA")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                    </Avatar>

                    {!isViewOnly && (
                      <>
                        <input
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          id="avatar-file"
                          type="file"
                          onChange={onFileChange}
                        />
                        <label htmlFor="avatar-file">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                          >
                            Upload Photo
                          </Button>
                        </label>
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Main Form Content */}
              <Grid size={{ xs: 12, sm: isEmployeeMode ? 8 : 12 }}>
                <Grid container spacing={2}>
                  {/* Common Fields */}
                  <Grid size={12}>
                    <CustomInput
                      type="name"
                      label={isEmployeeMode ? "Full name" : "Task Name"}
                      name="name"
                      value={form.name}
                      onInput={onInput}
                      readOnly={isViewOnly}
                      error={touched.name && errors.name}
                      helperText={
                        touched.name && errors.name ? "Required field" : ""
                      }
                      autoFocus={isEmployeeMode && !isViewOnly}
                      onBlur={() => {
                        if (form.name && isEmployeeMode) {
                          onInput("name", capitalizeName(form.name));
                        }
                      }}
                    />
                  </Grid>

                  {/* Employee-specific Fields */}
                  {isEmployeeMode ? (
                    <>
                      {/* Basic Information Row */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          type="email"
                          label="Email"
                          name="email"
                          value={form.email}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.email && errors.email}
                          helperText={
                            touched.email && errors.email
                              ? "Invalid email address"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          type="phone"
                          label="Contact"
                          name="phoneDigits"
                          value={form.phoneDigits}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.phoneDigits && errors.phoneDigits}
                          helperText={
                            touched.phoneDigits && errors.phoneDigits
                              ? "Enter 10 digit mobile number"
                              : ""
                          }
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 15,
                          }}
                        />
                      </Grid>

                      {/* Personal Information */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                          label="Date of Birth"
                          value={parseDateString(form.dob)}
                          onChange={handleDOBChange}
                          format="dd/MM/yyyy"
                          maxDate={new Date()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: touched.dob && errors.dob,
                              helperText:
                                touched.dob && errors.dob
                                  ? "Required field"
                                  : "",
                              ...textFieldProps,
                            },
                          }}
                          {...datePickerProps}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          select
                          label="Blood Group"
                          name="bloodGroup"
                          value={form.bloodGroup}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.bloodGroup && errors.bloodGroup}
                          helperText={
                            touched.bloodGroup && errors.bloodGroup
                              ? "Required field"
                              : ""
                          }
                          options={bloodGroupOptions}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          select
                          label="Marital Status"
                          name="maritalStatus"
                          value={form.maritalStatus || "Single"}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.maritalStatus && errors.maritalStatus}
                          helperText={
                            touched.maritalStatus && errors.maritalStatus
                              ? "Required field"
                              : ""
                          }
                          options={maritalStatusOptions}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          select
                          label="Nationality"
                          name="nationality"
                          value={form.nationality || "Indian"}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.nationality && errors.nationality}
                          helperText={
                            touched.nationality && errors.nationality
                              ? "Required field"
                              : ""
                          }
                          options={nationalityOptions}
                        />
                      </Grid>

                      <Grid size={12}>
                        <CustomInput
                          multiline
                          rows={2}
                          label="Address"
                          name="address"
                          value={form.address}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.address && errors.address}
                          helperText={
                            touched.address && errors.address
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      {/* Professional Information */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Department"
                          name="department"
                          value={form.department}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.department && errors.department}
                          helperText={
                            touched.department && errors.department
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Role"
                          name="role"
                          value={form.role}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.role && errors.role}
                          helperText={
                            touched.role && errors.role ? "Required field" : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          type="employeeId"
                          label="Employee ID"
                          name="employeeCodeDigits"
                          value={form.employeeCodeDigits}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={
                            touched.employeeCodeDigits &&
                            errors.employeeCodeDigits
                          }
                          helperText={
                            touched.employeeCodeDigits &&
                            errors.employeeCodeDigits
                              ? errors.employeeCodeDigits === true
                                ? "Enter exactly 4 digits"
                                : "Employee ID already exists"
                              : ""
                          }
                          placeholder="LSEMP0000"
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 9,
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Designation"
                          name="designation"
                          value={form.designation}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.designation && errors.designation}
                          helperText={
                            touched.designation && errors.designation
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Working Project"
                          name="workingProject"
                          value={form.workingProject}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={
                            touched.workingProject && errors.workingProject
                          }
                          helperText={
                            touched.workingProject && errors.workingProject
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                          label="Joining Date"
                          value={parseDateString(form.joiningDate)}
                          onChange={handleJoiningDateChange}
                          format="dd/MM/yyyy"
                          maxDate={new Date()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: touched.joiningDate && errors.joiningDate,
                              helperText:
                                touched.joiningDate && errors.joiningDate
                                  ? "Required field"
                                  : "",
                              ...textFieldProps,
                            },
                          }}
                          {...datePickerProps}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Location"
                          name="location"
                          value={form.location}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.location && errors.location}
                          helperText={
                            touched.location && errors.location
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          label="Position"
                          name="position"
                          value={form.position}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.position && errors.position}
                          helperText={
                            touched.position && errors.position
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          select
                          label="Work Format"
                          name="workFormat"
                          value={form.workFormat}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.workFormat && errors.workFormat}
                          helperText={
                            touched.workFormat && errors.workFormat
                              ? "Required field"
                              : ""
                          }
                          options={workFormatOptions}
                        />
                      </Grid>

                      {/* Auto-generated Credentials Display */}
                      {mode === "employee" &&
                        generatedCredentials &&
                        generatedCredentials.email &&
                        !isViewOnly && (
                          <Grid size={12}>
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <Typography
                                variant="subtitle2"
                                className="text-blue-700 font-semibold mb-1"
                              >
                                Auto-generated Login Credentials:
                              </Typography>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Typography
                                    variant="caption"
                                    className="text-gray-600"
                                  >
                                    Email:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="font-mono text-sm"
                                  >
                                    {generatedCredentials.email}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="caption"
                                    className="text-gray-600"
                                  >
                                    Password:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="font-mono text-sm"
                                  >
                                    {generatedCredentials.password}
                                  </Typography>
                                </div>
                              </div>
                              <Typography
                                variant="caption"
                                className="text-gray-500 mt-2 block"
                              >
                                These credentials will be saved to Firebase Auth
                                automatically. Employee will use these to login.
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-gray-500 mt-1 block"
                              >
                                Email format: name@lazysquad.com (all lowercase)
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-gray-500 mt-1 block"
                              >
                                Password format: NameEmployeeID (case-sensitive)
                              </Typography>
                            </div>
                          </Grid>
                        )}
                    </>
                  ) : (
                    /* Task-specific Fields */
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          type="taskId"
                          label="Task ID"
                          name="taskId"
                          value={form.taskId}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.taskId && errors.taskId}
                          helperText={
                            touched.taskId && errors.taskId
                              ? errors.taskId === true
                                ? "Required field - Enter 4 digits after TID-"
                                : "Task ID already exists"
                              : ""
                          }
                          placeholder="TID-0000"
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 8,
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          select
                          label="Assigned To"
                          name="assignedTo"
                          value={form.assignedTo}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.assignedTo && errors.assignedTo}
                          helperText={
                            touched.assignedTo && errors.assignedTo
                              ? "Required field"
                              : ""
                          }
                          options={employeeOptions}
                        />
                      </Grid>

                      {/* Created At - Use DIRECT DatePicker */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                          label="Created At"
                          value={
                            form.createdAt ? new Date(form.createdAt) : null
                          }
                          onChange={handleCreatedAtChange}
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: touched.createdAt && errors.createdAt,
                              helperText:
                                touched.createdAt && errors.createdAt
                                  ? "Required field"
                                  : "",
                              ...textFieldProps,
                            },
                          }}
                          {...datePickerProps}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomInput
                          type="number"
                          label="Sprint Days"
                          name="sprintDays"
                          value={form.sprintDays}
                          onInput={onInput}
                          readOnly={isViewOnly}
                          error={touched.sprintDays && errors.sprintDays}
                          helperText={
                            touched.sprintDays && errors.sprintDays
                              ? "Required field"
                              : ""
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        {/* Changed DatePicker for End Date */}
                        <DatePicker
                          label="End Date"
                          value={parseDateString(form.endDate)}
                          onChange={handleEndDateChange}
                          format="dd/MM/yyyy"
                          disabled={true}
                          readOnly={isViewOnly}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              ...textFieldProps,
                            },
                          }}
                          {...datePickerProps}
                        />
                      </Grid>

                      {/* Task Status Radio Buttons */}
                      <Grid size={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 2, color: "#333" }}
                          >
                            Task Status {!isViewOnly && "*"}
                          </Typography>
                          <RadioGroup
                            row
                            value={form.status || "active"}
                            onChange={handleRadioChange}
                            sx={{
                              display: "flex",
                              gap: 2,
                              justifyContent: "space-between",
                              width: "100%",
                              pointerEvents: isViewOnly ? "none" : "auto",
                            }}
                          >
                            {taskStatusOptions.map((option) => (
                              <CustomRadio
                                key={option.value}
                                value={option.value}
                                label={option.label}
                                color={option.color}
                                formStatus={form.status}
                                readOnly={isViewOnly}
                              />
                            ))}
                          </RadioGroup>
                          {touched.status && errors.status && (
                            <div
                              style={{
                                color: "crimson",
                                fontSize: 12,
                                marginTop: 1,
                              }}
                            >
                              Please select a task status
                            </div>
                          )}
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Description Field (for Tasks) */}
            {!isEmployeeMode && (
              <Box sx={{ mt: 2 }}>
                <CustomInput
                  multiline
                  rows={6}
                  label="Description"
                  name="description"
                  value={form.description}
                  onInput={onInput}
                  readOnly={isViewOnly}
                  error={touched.description && errors.description}
                  helperText={
                    touched.description && errors.description
                      ? "Required field"
                      : ""
                  }
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "16px",
                      lineHeight: "1.5",
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        {/* Dialog Actions - Conditionally render based on view-only mode */}
        {!isViewOnly ? (
          <DialogActions sx={{ px: 3, py: 2, background: "#fff", gap: 1 }}>
            {/* Delete Button - Only show when editing an employee */}
            {isEmployeeMode && isEditing && (
              <Button
                variant="contained"
                onClick={handleDeleteClick}
                sx={{
                  background: "linear-gradient(90deg,#ef4444,#dc2626)",
                  color: "#fff",
                  fontWeight: 700,
                  px: 3,
                  textTransform: "none",
                  boxShadow: "0 8px 30px rgba(239,68,68,0.18)",
                  "&:hover": {
                    background: "linear-gradient(90deg,#dc2626,#b91c1c)",
                    boxShadow: "0 10px 35px rgba(239,68,68,0.25)",
                  },
                  mr: "auto",
                }}
              >
                Delete
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{
                borderColor: "rgba(0,0,0,0.08)",
                color: "#333",
                px: 3,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff6b6b,#f43f5e)",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(244,63,94,0.18)",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmitForm}
              disabled={!formIsValid}
              sx={{
                background: "linear-gradient(90deg,#00c853,#00e5ff)",
                color: "#fff",
                fontWeight: 700,
                px: 3,
                textTransform: "none",
                boxShadow: "0 8px 30px rgba(3, 201, 136, 0.18)",
                "&:disabled": {
                  opacity: 0.6,
                  boxShadow: "none",
                },
              }}
            >
              {getSubmitButtonText()}
            </Button>
          </DialogActions>
        ) : (
          // View-only mode - Only show Close button
          <DialogActions sx={{ px: 3, py: 2, background: "#fff" }}>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{
                background: "linear-gradient(90deg,#6b7280,#4b5563)",
                color: "#fff",
                fontWeight: 700,
                px: 3,
                textTransform: "none",
                boxShadow: "0 8px 30px rgba(107,114,128,0.18)",
                "&:hover": {
                  background: "linear-gradient(90deg,#4b5563,#374151)",
                  boxShadow: "0 10px 35px rgba(107,114,128,0.25)",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </LocalizationProvider>
  );
};

export default CustomModal;
