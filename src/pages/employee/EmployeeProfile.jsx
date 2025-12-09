import React, { useEffect, useState } from "react";
import {
  Email,
  Phone,
  Bloodtype,
  CalendarMonth,
  Home,
  Flag,
  Work,
  Badge,
  Business,
  LocationOn,
  LaptopMac,
  Folder,
  Person,
  Favorite,
  Computer,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { getEmployeeByEmail } from "../../firebase/firebaseService";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user || !user.email) {
        setError("No user found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const employee = await getEmployeeByEmail(user.email);

        if (employee) {
          setEmployeeData(employee);
        } else {
          setError("Employee data not found");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Employee Profile
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading profile data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Employee Profile
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Employee Profile
        </h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-600">No employee data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
        Employee Profile
      </h1>

      {/* MAIN WRAPPER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* PERSONAL INFO CARD */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all">
          {/* CARD HEADER WITH GRADIENT */}
          <div className="p-3 sm:p-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg flex items-center gap-2">
            <i className="bi bi-person-vcard text-xl"></i>
            Personal Information
          </div>

          {/* CARD BODY */}
          <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 text-gray-700 text-sm">
            <InfoRow
              icon={<Person className="text-blue-600" />}
              label="Name"
              value={employeeData.name || "Not provided"}
            />

            <InfoRow
              icon={<Email className="text-red-500" />}
              label="Email"
              value={employeeData.email || "Not provided"}
            />

            <InfoRow
              icon={<Phone className="text-green-500" />}
              label="Contact"
              value={employeeData.phone || "Not provided"}
            />

            <InfoRow
              icon={<Bloodtype className="text-pink-600" />}
              label="Blood Group"
              value={employeeData.bloodGroup || "Not provided"}
            />

            {/* Marital Status - You can add this field to your employee data if needed */}
            <div className="flex items-center gap-3">
              <Favorite className="text-rose-500" />
              <span className="font-semibold text-gray-800">
                Marital Status:
              </span>
              <span className="text-gray-600">
                {employeeData.maritalStatus || "Not provided"}
              </span>
            </div>

            <InfoRow
              icon={<CalendarMonth className="text-purple-600" />}
              label="Birth Date"
              value={employeeData.dob || "Not provided"}
            />

            <InfoRow
              icon={<Home className="text-orange-600" />}
              label="Address"
              value={employeeData.address || "Not provided"}
            />

            <InfoRow
              icon={<Flag className="text-blue-700" />}
              label="Nationality"
              value={employeeData.nationality || "Not provided"}
            />
          </div>
        </div>

        {/* PROFESSIONAL INFO CARD */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all">
          {/* CARD HEADER WITH GRADIENT */}
          <div className="p-3 sm:p-4 rounded-t-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold text-lg flex items-center gap-2">
            <i className="bi bi-briefcase-fill text-xl"></i>
            Professional Information
          </div>

          {/* CARD BODY */}
          <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 text-gray-700 text-sm">
            <InfoRow
              icon={<Business className="text-green-600" />}
              label="Department"
              value={employeeData.department || "Not provided"}
            />

            <InfoRow
              icon={<Work className="text-red-600" />}
              label="Role"
              value={employeeData.role || "Not provided"}
            />

            <InfoRow
              icon={<Badge className="text-purple-600" />}
              label="Employee ID"
              value={employeeData.employeeCode || "Not provided"}
            />

            <InfoRow
              icon={<LaptopMac className="text-gray-700" />}
              label="Designation"
              value={employeeData.designation || "Not provided"}
            />

            <InfoRow
              icon={<Folder className="text-blue-700" />}
              label="Working Project"
              value={employeeData.workingProject || "Not provided"}
            />

            <InfoRow
              icon={<CalendarMonth className="text-indigo-600" />}
              label="Joining Date"
              value={employeeData.joiningDate || "Not provided"}
            />

            <InfoRow
              icon={<LocationOn className="text-pink-600" />}
              label="Location"
              value={employeeData.location || "Not provided"}
            />

            {/* Work Format */}
            <InfoRow
              icon={<Computer className="text-violet-600" />}
              label="Work Format"
              value={employeeData.workFormat || "Not provided"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE ROW COMPONENT */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-lg">{icon}</span>
    <span className="font-semibold text-gray-800">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);
