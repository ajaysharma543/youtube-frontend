import React, { useEffect, useState } from "react";
import Navbar from "./dashboard_components/navbar";
import LogoutButton from "../auth/logout";
// import { Link } from "react-router-dom";
import Sidebar from "./dashboard_components/slidebar";
const DashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1310 && window.innerWidth >= 768) {
        setIsCollapsed(true); 
      } else {
        setIsCollapsed(collapse); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [collapse]);

  return (
    <div className="flex flex-col flex-wrap mt-15 min-h-screen bg-black text-white">

      <Navbar
        onToggleSidebar={() => setCollapse(prev => !prev)}
        onToggleMobile={() => setMobileOpen(prev => !prev)}
      />

      <div className="flex flex-1">

        <Sidebar
          collapse={isCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main
          className={`
            flex-1 overflow-y-auto p-6 transition-all duration-300
            ml-0
            ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          `}
        >
          {children}
        </main>

      </div>
    </div>
  );
};


export default DashboardLayout;
