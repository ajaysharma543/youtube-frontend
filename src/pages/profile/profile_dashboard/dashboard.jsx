import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../dashboard/dashboard_components/navbar";
import Sidebar from "./slidebar";
import LogoutButton from "../../auth/logout";

const ProfileDashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <div className=" px-6 py-3 border-b border-gray-800 bg-black z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden scrollbar-hide">
        <div className="w-64 border-r border-gray-800 bg-black scrollbar-hide overflow-y-auto h-full">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-6 dark-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfileDashboardLayout;
