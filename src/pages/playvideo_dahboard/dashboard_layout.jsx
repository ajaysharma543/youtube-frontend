import React, { useState } from "react";
import Navbar from "../dashboard/dashboard_components/navbar";
import Sidebar from "./sidebar";

const VideoDashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar
        onToggleSidebar={() => setCollapse((prev) => !prev)}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        <Sidebar
          sidebarOpen={collapse}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <main className="flex-1 overflow-y-auto p-6 pt-[80px]">{children}</main>
      </div>
    </div>
  );
};

export default VideoDashboardLayout;
