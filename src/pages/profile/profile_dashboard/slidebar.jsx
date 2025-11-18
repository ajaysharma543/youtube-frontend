import React from "react";
import { Home, Settings, PlayCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { data, loading } = useSelector((state) => state.user);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (!data)
    return (
      <p className="text-white text-center mt-10">
        No user found. Please log in.
      </p>
    );

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    { to: "/content", label: "Content", icon: <Users className="w-5 h-5" /> },
    {
      to: "/channel-customize",
      label: "Customization",
      icon: <PlayCircle className="w-5 h-5" />,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen w-64 bg-black text-white flex flex-col items-center py-10 border-r border-black">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-800 text-5xl font-bold shadow-lg">
          {data.fullname ? data.fullname.charAt(0).toUpperCase() : "?"}
        </div>

        <h2 className="text-2xl font-semibold mt-4">{data.fullname}</h2>
        <p className="text-gray-400 text-sm mt-1">@{data.username}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 w-full px-6 text-gray-400">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 text-lg px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#1c1c1c] text-white shadow-md"
                  : "hover:text-white hover:bg-[#1c1c1c]"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
