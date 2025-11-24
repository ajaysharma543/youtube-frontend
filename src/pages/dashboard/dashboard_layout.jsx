import React, { useEffect, useState } from "react";
import Navbar from "./dashboard_components/navbar";
import LogoutButton from "../auth/logout";
// import { Link } from "react-router-dom";
import Sidebar from "./dashboard_components/slidebar";
const DashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 1310 && width >= 768) {
        // Tablet mode
        setIsTablet(true);
        setIsCollapsed(true); // Force collapsed layout
      } else {
        // Desktop mode
        setIsTablet(false);
        setIsCollapsed(collapse); // Use normal collapse value
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [collapse]);

  return (
    <div className="flex flex-col flex-wrap mt-15 min-h-screen bg-black text-white">
      <Navbar
        onToggleSidebar={() => setCollapse((prev) => !prev)}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        <Sidebar
          collapse={isCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isTablet={isTablet}
        />

        <main
          className={`
            flex-1 overflow-y-auto p-6 transition-all duration-300
            ml-0
            ${isCollapsed ? "md:ml-20" : "md:ml-60"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
