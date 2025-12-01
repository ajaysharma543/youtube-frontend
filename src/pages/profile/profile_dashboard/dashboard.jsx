import React, { useState } from "react";
import Sidebar from "./slidebar";
import Navbar from "./navbar";
import { NavLink } from "react-router-dom";
import { Home, Users, PlayCircle, Settings } from "lucide-react";

const ProfileDashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { to: "/content", label: "Content", icon: <Users size={22} /> },
    {
      to: "/channel-customize",
      label: "Customize",
      icon: <PlayCircle size={22} />,
    },
    { to: "/settings", label: "Settings", icon: <Settings size={22} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* TOP NAV */}
      <div className="px-6 py-3 border-b border-gray-800 bg-black">
        <Navbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />
      </div>

      {/* MAIN */}
      <div className="flex flex-1">
        {/* SIDEBAR (DESKTOP) */}
        <div
          className={`
            hidden sm:block border-r border-gray-800 bg-black
            transition-all duration-300 mt-5
            ${collapsed ? "w-16" : "w-64"}
          `}
        >
          <Sidebar collapsed={collapsed} />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-h-[calc(100vh-120px)] pb-[60px] sm:pb-0 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* MOBILE NAV */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 px-4 py-2 flex justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-white" : "text-gray-400"
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProfileDashboardLayout;
