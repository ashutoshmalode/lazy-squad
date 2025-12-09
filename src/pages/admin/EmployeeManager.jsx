import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux-toolkit/Hooks";
import {
  setSearch,
  setForm,
  setTouched,
  setEditingEmployee,
  resetForm,
  resetTouched,
  fetchEmployees,
  addEmployeeAsync,
  updateEmployeeAsync,
  deleteEmployeeAsync,
} from "../../redux-toolkit/slices/EmployeeSlice";
import {
  createEmployeeUser,
  deleteEmployeeUser,
  updateEmployeeCredentials,
} from "../../firebase/Auth";
import CustomCard from "../../components/CustomCard";
import CustomModal from "../../components/CustomModal";
import CustomButton from "../../components/CustomButton";
import CustomFilter from "../../components/CustomFilter";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhoneDigits(phoneDigits) {
  return /^\d{10}$/.test(phoneDigits);
}
function validateDOB(dob) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dob);
}
function fourDigitNumber(val) {
  return /^\d{4}$/.test(val);
}
function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name) && name.trim().length > 0;
}

export default function EmployeeManager() {
  const dispatch = useAppDispatch();
  const { employees, search, form, touched, editingEmployee, loading, error } =
    useAppSelector((state) => state.employees);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);
  const fileInputRef = useRef(null);

  // 🔥 FETCH EMPLOYEES ON COMPONENT MOUNT
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // filtered list
  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(q) ||
        (emp.employeeCode || "").toLowerCase().includes(q) ||
        (emp.id || "").toLowerCase().includes(q) ||
        (emp.position || "").toLowerCase().includes(q) ||
        (emp.phone || "").toLowerCase().includes(q) ||
        (emp.email || "").toLowerCase().includes(q)
      );
    });
  }, [search, employees]);

  // Check if employee ID already exists
  const isEmployeeIdExists = (employeeCodeDigits) => {
    const employeeCode = `LSEMP${employeeCodeDigits}`;
    return employees.some((emp) => emp.employeeCode === employeeCode);
  };

  // Next employee code default generator
  const nextEmployeeCodeDigits = () => {
    const nums = employees
      .map((e) => (e.employeeCode || "").replace(/^LSEMP/, ""))
      .filter((s) => /^\d+$/.test(s))
      .map((s) => parseInt(s, 10));
    const max = nums.length ? Math.max(...nums) : 0;
    const next = (max + 1).toString().padStart(4, "0");
    return next;
  };

  // open modal for add
  const handleOpenAdd = () => {
    dispatch(setEditingEmployee(null));
    dispatch(resetForm());
    dispatch(resetTouched());
    setGeneratedCredentials(null);
    setIsUpdatingCredentials(false);
    setModalOpen(true);
  };

  // open modal for edit
  const handleOpenEdit = (employee) => {
    dispatch(setEditingEmployee(employee));
    dispatch(
      setForm({
        avatarDataUrl: employee.avatarDataUrl || null,
        avatarColor: employee.avatarColor || "#888",
        name: employee.name || "",
        email: employee.email || "",
        phoneDigits: (employee.phone || "")
          .replace(/^\+91\s?/, "")
          .replace(/\D/g, "")
          .slice(0, 10),
        dob: employee.dob || "",
        bloodGroup: employee.bloodGroup || "",
        department: employee.department || "",
        role: employee.role || "",
        employeeCodeDigits: (employee.employeeCode || "")
          .replace(/^LSEMP/, "")
          .slice(0, 4),
        designation: employee.designation || "",
        workingProject: employee.workingProject || "",
        joiningDate: employee.joiningDate || "",
        location: employee.location || "",
        workFormat: employee.workFormat || "",
        position: employee.position || "",
      })
    );
    dispatch(resetTouched());
    setGeneratedCredentials(null);
    setIsUpdatingCredentials(false);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    dispatch(setEditingEmployee(null));
    dispatch(resetForm());
    setGeneratedCredentials(null);
    setIsUpdatingCredentials(false);
  };

  // file -> dataURL preview
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch(setForm({ avatarDataUrl: ev.target.result }));
    };
    reader.readAsDataURL(f);
  };

  const handleInput = (key, value) => {
    dispatch(setForm({ [key]: value }));
    dispatch(setTouched({ [key]: true }));

    // Auto-generate email when name changes (only for new employee)
    if (key === "name" && value && editingEmployee === null) {
      const generatedEmail = generateEmployeeEmail(value);
      dispatch(setForm({ email: generatedEmail }));
    }

    // Check if email or employee code is being updated for existing employee
    if (editingEmployee !== null) {
      if (
        (key === "email" && value !== editingEmployee.email) ||
        (key === "employeeCodeDigits" &&
          `LSEMP${value}` !== editingEmployee.employeeCode)
      ) {
        setIsUpdatingCredentials(true);
      } else if (
        key === "email" &&
        value === editingEmployee.email &&
        key === "employeeCodeDigits" &&
        `LSEMP${value}` === editingEmployee.employeeCode
      ) {
        setIsUpdatingCredentials(false);
      }
    }
  };

  // Helper function to generate email from name
  const generateEmployeeEmail = (name) => {
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "";
    const lastName = nameParts.slice(1).join("").toLowerCase() || "";
    return `${firstName}${lastName}@lazysquad.com`;
  };

  // form validation for employees
  const errors = {
    name: !validateName(form.name || ""),
    email: !validateEmail(form.email || ""),
    phoneDigits: !validatePhoneDigits(form.phoneDigits || ""),
    dob: !validateDOB(form.dob || ""),
    bloodGroup: !form.bloodGroup,
    department: !form.department,
    role: !form.role,
    employeeCodeDigits:
      !fourDigitNumber(form.employeeCodeDigits || "") ||
      (editingEmployee === null && isEmployeeIdExists(form.employeeCodeDigits)),
    designation: !form.designation,
    workingProject: !form.workingProject,
    joiningDate: !form.joiningDate,
    location: !form.location,
    workFormat: !form.workFormat,
    position: !form.position,
  };

  const formIsValid = Object.values(errors).every((v) => v === false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(errors).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    dispatch(setTouched(allTouched));

    if (!formIsValid) return;

    // Auto-generate employee code if empty during submission
    const employeeCodeDigits =
      form.employeeCodeDigits || nextEmployeeCodeDigits();
    const employeeCode = `LSEMP${employeeCodeDigits}`;

    const newEmployee = {
      employeeCode,
      name: form.name.trim(),
      email: form.email.trim(), // Use the exact email from form
      phone: `+91 ${form.phoneDigits}`,
      position: form.position,
      avatarColor: form.avatarColor || "#888",
      avatarDataUrl: form.avatarDataUrl || null,
      dob: form.dob,
      bloodGroup: form.bloodGroup,
      department: form.department,
      role: form.role,
      designation: form.designation,
      workingProject: form.workingProject,
      joiningDate: form.joiningDate,
      location: form.location,
      workFormat: form.workFormat,
    };

    if (editingEmployee === null) {
      try {
        // Generate credentials for display
        const generatedEmail = form.email.trim();
        const generatedPassword = employeeCode; // Use Employee ID as password

        // First create Firebase Auth user with EXACT email from form
        await createEmployeeUser({
          ...newEmployee,
          name: form.name.trim(),
          email: form.email.trim(), // Use exact email
          employeeCode: employeeCode,
        });

        // Set generated credentials for display
        setGeneratedCredentials({
          email: generatedEmail,
          password: generatedPassword,
        });

        // Then add to Firestore employees collection
        dispatch(addEmployeeAsync(newEmployee));

        // Don't close modal yet - show credentials
        // Modal will close after user sees the credentials
      } catch (error) {
        console.error("Error creating employee user:", error);
        alert(`Error creating employee: ${error.message}`);
        return;
      }
    } else {
      try {
        // Check if credentials need to be updated
        const oldEmail = editingEmployee.email;
        const oldEmployeeCode = editingEmployee.employeeCode;
        const newEmail = form.email.trim();
        const newEmployeeCode = employeeCode;

        if (
          isUpdatingCredentials &&
          (oldEmail !== newEmail || oldEmployeeCode !== newEmployeeCode)
        ) {
          // Update Firebase Auth credentials
          await updateEmployeeCredentials(oldEmail, newEmail, newEmployeeCode);
        }

        // 🔥 FIREBASE: UPDATE EMPLOYEE
        dispatch(
          updateEmployeeAsync({
            id: editingEmployee.id,
            employeeData: newEmployee,
          })
        );
        setModalOpen(false);
        dispatch(resetForm());
        setIsUpdatingCredentials(false);
        alert("Employee updated successfully!");
      } catch (error) {
        console.error("Error updating employee:", error);
        alert(`Error updating employee: ${error.message}`);
      }
    }
  };

  // Delete employee function
  const handleDeleteEmployee = async () => {
    if (editingEmployee) {
      if (
        window.confirm(
          `Are you sure you want to delete ${editingEmployee.name}? This will remove ALL their data including login credentials. This action cannot be undone.`
        )
      ) {
        try {
          // First delete from Firebase Auth and Firestore
          await deleteEmployeeUser(editingEmployee);

          // Then delete from Redux/Firestore
          dispatch(deleteEmployeeAsync(editingEmployee.id));

          setModalOpen(false);
          dispatch(resetForm());

          alert(
            `${editingEmployee.name} has been completely deleted from the system.`
          );
        } catch (error) {
          console.error("Error deleting employee:", error);
          alert(
            `Error deleting employee: ${error.message}\n\nYou may need to manually clean up from Firebase Console:\n1. Authentication → Delete user\n2. Firestore → Delete from employees & users collections`
          );
        }
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
          Employee Manager
        </h1>

        <CustomButton onClick={handleOpenAdd}>Add New Employee</CustomButton>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600">Loading employees...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Custom Filter */}
      <CustomFilter
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search employee by name, ID, position, phone..."
      />

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length ? (
          filteredEmployees.map((emp, idx) => (
            <CustomCard
              key={emp.id || idx}
              employee={emp}
              onClick={() => handleOpenEdit(emp)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            {loading ? "Loading employees..." : "No employees found."}
          </p>
        )}
      </div>

      {/* CUSTOM MODAL for Employees */}
      <CustomModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onDelete={handleDeleteEmployee}
        mode="employee"
        editingItem={editingEmployee}
        form={form}
        touched={touched}
        errors={errors}
        formIsValid={formIsValid}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onInput={handleInput}
        nextEmployeeCodeDigits={nextEmployeeCodeDigits}
        generatedCredentials={generatedCredentials}
        isUpdatingCredentials={isUpdatingCredentials}
      />
    </Box>
  );
}
