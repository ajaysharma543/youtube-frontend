// VideoDashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const VideoDashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar collapse={collapse} setCollapse={setCollapse} />

      <div className="flex flex-1">
        <Sidebar sidebarOpen={collapse} setSidebarOpen={setCollapse} />

        <main className="flex-1 overflow-y-auto p-6 max-sm:pt-14 pt-15 max-md:p-1 max-md:pt-20 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VideoDashboardLayout;
