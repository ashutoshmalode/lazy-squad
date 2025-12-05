import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  Box,
  RadioGroup,
  Typography,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Custom Radio Component for Task Status
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

  // Function to validate name (only letters and spaces)
  const validateName = (name) => {
    return /^[A-Za-z\s]*$/.test(name);
  };

  // Function to format phone number with +91
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    return digits;
  };

  // Function to handle name input with validation and capitalization
  const handleNameInput = (value) => {
    if (validateName(value)) {
      onInput("name", value);
    }
  };

  // Function to handle phone input with formatting
  const handlePhoneInput = (value) => {
    const formatted = formatPhoneNumber(value);
    onInput("phoneDigits", formatted);
  };

  // Function to handle employee ID input
  const handleEmployeeIdInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    onInput("employeeCodeDigits", digits);
  };

  // Function to handle task ID input
  const handleTaskIdInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    onInput("taskId", digits);
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

  const handleCreatedAtChange = (newValue) => {
    if (isViewOnly) return;
    const formattedDate = newValue ? newValue.toISOString().slice(0, 16) : "";
    onInput("createdAt", formattedDate);
  };

  const handleDOBChange = (newValue) => {
    if (isViewOnly) return;
    if (newValue) {
      const formattedDate = newValue.toLocaleDateString("en-GB"); // dd/mm/yyyy format
      onInput("dob", formattedDate);
    } else {
      onInput("dob", "");
    }
  };

  const handleJoiningDateChange = (newValue) => {
    if (isViewOnly) return;
    if (newValue) {
      const formattedDate = newValue.toLocaleDateString("en-GB"); // dd/mm/yyyy format
      onInput("joiningDate", formattedDate);
    } else {
      onInput("joiningDate", "");
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

  // Common select props for read-only mode
  const selectProps = isViewOnly
    ? {
        disabled: true,
        sx: {
          "& .MuiSelect-select": {
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

  // Blood group options
  const bloodGroupOptions = ["A", "A+", "B", "B+", "AB+", "AB-", "O+", "O-"];

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
                    <TextField
                      fullWidth
                      label={isEmployeeMode ? "Full name" : "Task Name"}
                      value={form.name}
                      onChange={
                        isViewOnly
                          ? undefined
                          : (e) => handleNameInput(e.target.value)
                      }
                      onBlur={
                        isViewOnly || !isEmployeeMode
                          ? undefined
                          : (e) => {
                              if (form.name) {
                                onInput("name", capitalizeName(form.name));
                              }
                            }
                      }
                      autoFocus={isEmployeeMode && !isViewOnly}
                      {...textFieldProps}
                    />
                    {touched.name && errors.name && (
                      <div style={{ color: "crimson", fontSize: 12 }}>
                        Required field
                      </div>
                    )}
                  </Grid>

                  {/* Employee-specific Fields */}
                  {isEmployeeMode ? (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={form.email}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("email", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.email && errors.email && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Invalid email address
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Contact"
                          value={
                            form.phoneDigits
                              ? `+91 ${form.phoneDigits}`
                              : "+91 "
                          }
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) =>
                                  handlePhoneInput(
                                    e.target.value.replace("+91 ", "")
                                  )
                          }
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 15,
                            readOnly: isViewOnly,
                          }}
                          {...textFieldProps}
                        />
                        {touched.phoneDigits && errors.phoneDigits && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Enter 10 digit mobile number
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Birth"
                            value={
                              form.dob
                                ? new Date(
                                    form.dob.split("/").reverse().join("-")
                                  )
                                : null
                            }
                            onChange={handleDOBChange}
                            format="dd/MM/yyyy"
                            maxDate={new Date()}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                ...textFieldProps,
                              },
                            }}
                            {...datePickerProps}
                          />
                        </LocalizationProvider>
                        {touched.dob && errors.dob && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="blood-group-label">
                            Blood Group
                          </InputLabel>
                          <Select
                            labelId="blood-group-label"
                            label="Blood Group"
                            value={form.bloodGroup}
                            onChange={
                              isViewOnly
                                ? undefined
                                : (e) => onInput("bloodGroup", e.target.value)
                            }
                            {...selectProps}
                          >
                            {bloodGroupOptions.map((group) => (
                              <MenuItem key={group} value={group}>
                                {group}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.bloodGroup && errors.bloodGroup && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Department"
                          value={form.department}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("department", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.department && errors.department && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Role"
                          value={form.role}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("role", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.role && errors.role && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Employee ID"
                          value={
                            form.employeeCodeDigits
                              ? `LSEMP${form.employeeCodeDigits}`
                              : "LSEMP"
                          }
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) =>
                                  handleEmployeeIdInput(
                                    e.target.value.replace("LSEMP", "")
                                  )
                          }
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 9,
                            readOnly: isViewOnly,
                          }}
                          placeholder="LSEMP0000"
                          {...textFieldProps}
                        />
                        {touched.employeeCodeDigits &&
                          errors.employeeCodeDigits && (
                            <div style={{ color: "crimson", fontSize: 12 }}>
                              {errors.employeeCodeDigits === true
                                ? "Enter exactly 4 digits"
                                : "Employee ID already exists"}
                            </div>
                          )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Designation"
                          value={form.designation}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("designation", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.designation && errors.designation && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Working Project"
                          value={form.workingProject}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("workingProject", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.workingProject && errors.workingProject && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Joining Date"
                            value={
                              form.joiningDate
                                ? new Date(
                                    form.joiningDate
                                      .split("/")
                                      .reverse()
                                      .join("-")
                                  )
                                : null
                            }
                            onChange={handleJoiningDateChange}
                            format="dd/MM/yyyy"
                            maxDate={new Date()}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                ...textFieldProps,
                              },
                            }}
                            {...datePickerProps}
                          />
                        </LocalizationProvider>
                        {touched.joiningDate && errors.joiningDate && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={form.location}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("location", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.location && errors.location && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Position"
                          value={form.position}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("position", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.position && errors.position && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="work-format-label">
                            Work Format
                          </InputLabel>
                          <Select
                            labelId="work-format-label"
                            label="Work Format"
                            value={form.workFormat}
                            onChange={
                              isViewOnly
                                ? undefined
                                : (e) => onInput("workFormat", e.target.value)
                            }
                            {...selectProps}
                          >
                            <MenuItem value="Remote">Remote</MenuItem>
                            <MenuItem value="In-Office">In-Office</MenuItem>
                            <MenuItem value="Hybrid">Hybrid</MenuItem>
                          </Select>
                        </FormControl>
                        {touched.workFormat && errors.workFormat && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>
                    </>
                  ) : (
                    /* Task-specific Fields */
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Task ID"
                          value={form.taskId ? `TID-${form.taskId}` : "TID-"}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) =>
                                  handleTaskIdInput(
                                    e.target.value.replace("TID-", "")
                                  )
                          }
                          inputProps={{
                            inputMode: "numeric",
                            maxLength: 8,
                            readOnly: isViewOnly,
                          }}
                          placeholder="TID-0000"
                          {...textFieldProps}
                        />
                        {touched.taskId && errors.taskId && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            {errors.taskId === true
                              ? "Required field - Enter 4 digits after TID-"
                              : "Task ID already exists"}
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="assigned-to-label">
                            Assigned To
                          </InputLabel>
                          <Select
                            labelId="assigned-to-label"
                            label="Assigned To"
                            value={form.assignedTo}
                            onChange={
                              isViewOnly
                                ? undefined
                                : (e) => onInput("assignedTo", e.target.value)
                            }
                            {...selectProps}
                          >
                            {employees.map((employee) => (
                              <MenuItem
                                key={employee.id}
                                value={`${employee.employeeCode} - ${employee.name}`}
                              >
                                {employee.employeeCode} - {employee.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.assignedTo && errors.assignedTo && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                          label="Created At"
                          value={
                            form.createdAt ? new Date(form.createdAt) : null
                          }
                          onChange={
                            isViewOnly ? undefined : handleCreatedAtChange
                          }
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              ...textFieldProps,
                            },
                          }}
                          {...datePickerProps}
                        />
                        {touched.createdAt && errors.createdAt && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Sprint Days"
                          type="number"
                          value={form.sprintDays}
                          onChange={
                            isViewOnly
                              ? undefined
                              : (e) => onInput("sprintDays", e.target.value)
                          }
                          {...textFieldProps}
                        />
                        {touched.sprintDays && errors.sprintDays && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            Required field
                          </div>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                          label="End Date"
                          value={form.endDate ? new Date(form.endDate) : null}
                          readOnly
                          disabled
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              ...textFieldProps,
                            },
                          }}
                        />
                        {touched.endDate && errors.endDate && (
                          <div style={{ color: "crimson", fontSize: 12 }}>
                            End date will be calculated automatically
                          </div>
                        )}
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
                            onChange={
                              isViewOnly ? undefined : handleRadioChange
                            }
                            sx={{
                              display: "flex",
                              gap: 2,
                              justifyContent: "space-between",
                              width: "100%",
                              pointerEvents: isViewOnly ? "none" : "auto",
                            }}
                          >
                            <CustomRadio
                              value="active"
                              label="Active"
                              color="#06b6d4"
                              formStatus={form.status}
                              readOnly={isViewOnly}
                            />
                            <CustomRadio
                              value="completed"
                              label="Completed"
                              color="#10b981"
                              formStatus={form.status}
                              readOnly={isViewOnly}
                            />
                            <CustomRadio
                              value="failed"
                              label="Failed"
                              color="#ef4444"
                              formStatus={form.status}
                              readOnly={isViewOnly}
                            />
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
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Description"
                  value={form.description}
                  onChange={
                    isViewOnly
                      ? undefined
                      : (e) => onInput("description", e.target.value)
                  }
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "16px",
                      lineHeight: "1.5",
                      ...(isViewOnly && {
                        backgroundColor: "#f5f5f5",
                        cursor: "default",
                      }),
                    },
                  }}
                  InputProps={{
                    readOnly: isViewOnly,
                  }}
                />
                {touched.description && errors.description && (
                  <div style={{ color: "crimson", fontSize: 12 }}>
                    Required field
                  </div>
                )}
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
