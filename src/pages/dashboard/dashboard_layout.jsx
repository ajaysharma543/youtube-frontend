import React, { useEffect, useState } from "react";
import Navbar from "./dashboard_components/navbar";
import LogoutButton from "../auth/logout";
import Sidebar from "./dashboard_components/slidebar";

const DashboardLayout = ({ children }) => {
  const [collapse, setCollapse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // 🔥 NEW: treat 639 and below as pure mobile
      if (width <= 639) {
        setIsTablet(false);
        setIsCollapsed(false);
        setMobileOpen(false);
        return;
      }

      // mobile <768
      if (width < 768) {
        setIsTablet(false);
        setIsCollapsed(false);
        return;
      }

      // auto close mobile sidebar when >=768
      if (width >= 768) {
        setMobileOpen(false);
      }

      // Tablet mode: 768 → 1310
      if (width <= 1310 && width >= 768) {
        setIsTablet(true);
        setIsCollapsed(true);
      } 
      // Desktop mode: 1311+
      else {
        setIsTablet(false);
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
            flex-1 overflow-y-auto p-6 max-md:p-0 pt-20 transition-all duration-300
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
