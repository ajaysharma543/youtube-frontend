import React, { useState } from "react";
import Navbar from "./dashboard_components/navbar";
import LogoutButton from "../auth/logout";
// import { Link } from "react-router-dom";
import Sidebar from "./dashboard_components/slidebar";
const DashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // ✅ For mobile drawer

  return (
    <div className="flex flex-col flex-wrap mt-15 min-h-screen bg-black text-white">
      {/* <LogoutButton /> */}

      <Navbar
        onToggleSidebar={() => setCollapse((prev) => !prev)}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        <Sidebar
          collapse={collapse}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main
          className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
            collapse ? "ml-20" : "ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
