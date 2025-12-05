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

export default function AdminProfile() {
  return (
    <div className="w-full px-10 py-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Admin Profile
      </h1>

      {/* MAIN WRAPPER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFO CARD */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all">
          {/* CARD HEADER WITH GRADIENT */}
          <div className="p-4 rounded-t-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg flex items-center gap-2">
            <i className="bi bi-person-vcard text-xl"></i>
            Personal Information
          </div>

          {/* CARD BODY */}
          <div className="p-5 space-y-4 text-gray-700 text-sm">
            {/* ✔ UPDATED ICON → Person */}
            <InfoRow
              icon={<Person className="text-blue-600" />}
              label="Name"
              value="Ashutosh Malode"
            />

            <InfoRow
              icon={<Email className="text-red-500" />}
              label="Email"
              value="ashutosh@lazysquad.com"
            />
            <InfoRow
              icon={<Phone className="text-green-500" />}
              label="Contact"
              value="9876543210"
            />
            <InfoRow
              icon={<Bloodtype className="text-pink-600" />}
              label="Blood Group"
              value="O+"
            />

            {/* ✔ UPDATED ICON → Heart/Couple icon */}
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
              value="Hyderabad, Telangana, India."
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
          <div className="p-4 rounded-t-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold text-lg flex items-center gap-2">
            <i className="bi bi-briefcase-fill text-xl"></i>
            Professional Information
          </div>

          {/* CARD BODY */}
          <div className="p-5 space-y-4 text-gray-700 text-sm">
            <InfoRow
              icon={<Business className="text-green-600" />}
              label="Department"
              value="IT & Softwares"
            />
            <InfoRow
              icon={<Work className="text-red-600" />}
              label="Role"
              value="Admin"
            />
            <InfoRow
              icon={<Badge className="text-purple-600" />}
              label="Admin ID"
              value="LS001"
            />
            <InfoRow
              icon={<LaptopMac className="text-gray-700" />}
              label="Designation"
              value="Associate Frontend Developer"
            />
            <InfoRow
              icon={<Folder className="text-blue-700" />}
              label="Working Project"
              value="Employee Management System"
            />
            <InfoRow
              icon={<CalendarMonth className="text-indigo-600" />}
              label="Joining Date"
              value="01-01-2025"
            />
            <InfoRow
              icon={<LocationOn className="text-pink-600" />}
              label="Location"
              value="Hyderabad"
            />

            {/* ✔ UPDATED ICON → Working on laptop person */}
            <InfoRow
              icon={<Computer className="text-violet-600" />}
              label="Work Format"
              value="Hybrid"
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
