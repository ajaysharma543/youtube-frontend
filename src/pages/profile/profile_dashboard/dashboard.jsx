import React, { useState } from "react";
import Sidebar, { MobileNav } from "./slidebar";
import Navbar from "./navbar";

const ProfileDashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">

      <div className="px-6 py-3 border-b border-gray-800 bg-black z-50">
        <Navbar onToggleSidebar={() => setCollapsed(prev => !prev)} />
      </div>

      <div className="flex flex-1 overflow-hidden scrollbar-hide">

        {/* Desktop Sidebar */}
        <div
          className={`border-r max-[640px]:hidden border-gray-800 pt-10 bg-black 
           scrollbar-hide overflow-y-auto h-full transition-all duration-300
           ${collapsed ? "w-16" : "w-64"}
          `}
        >
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 dark-scrollbar">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default ProfileDashboardLayout;
