import React from "react";
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

export default function EmployeeProfile() {
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
              value="Employee First"
            />

            <InfoRow
              icon={<Email className="text-red-500" />}
              label="Email"
              value="employee1@lazysquad.com"
            />
            <InfoRow
              icon={<Phone className="text-green-500" />}
              label="Contact"
              value="1192882982"
            />
            <InfoRow
              icon={<Bloodtype className="text-pink-600" />}
              label="Blood Group"
              value="O+"
            />

            {/* Marital Status */}
            <div className="flex items-center gap-3">
              <Favorite className="text-rose-500" />
              <span className="font-semibold text-gray-800">
                Marital Status:
              </span>
              <span className="text-gray-600">Single</span>
            </div>

            <InfoRow
              icon={<CalendarMonth className="text-purple-600" />}
              label="Birth Date"
              value="06-09-1999"
            />
            <InfoRow
              icon={<Home className="text-orange-600" />}
              label="Address"
              value="Pune, Maharashtra, India."
            />
            <InfoRow
              icon={<Flag className="text-blue-700" />}
              label="Nationality"
              value="Indian"
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
              value="IT & Softwares"
            />
            <InfoRow
              icon={<Work className="text-red-600" />}
              label="Role"
              value="Employee"
            />
            <InfoRow
              icon={<Badge className="text-purple-600" />}
              label="Employee ID"
              value="EMP0001"
            />
            <InfoRow
              icon={<LaptopMac className="text-gray-700" />}
              label="Designation"
              value="Frontend Developer Intern"
            />
            <InfoRow
              icon={<Folder className="text-blue-700" />}
              label="Working Project"
              value="Employee Management System"
            />
            <InfoRow
              icon={<CalendarMonth className="text-indigo-600" />}
              label="Joining Date"
              value="01-03-2025"
            />
            <InfoRow
              icon={<LocationOn className="text-pink-600" />}
              label="Location"
              value="Hyderabad"
            />

            {/* Work Format */}
            <InfoRow
              icon={<Computer className="text-violet-600" />}
              label="Work Format"
              value="Remote"
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
