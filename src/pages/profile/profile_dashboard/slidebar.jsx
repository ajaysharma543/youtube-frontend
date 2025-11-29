import { Home, PlayCircle, Settings, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed }) => {
  const { data, loading } = useSelector((state) => state.user);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (!data)
    return <p className="text-white text-center mt-10">No user found. Please log in.</p>;

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="w-7 h-7" /> },
    { to: "/content", label: "Content", icon: <Users className="w-7 h-7" /> },
    { to: "/channel-customize", label: "Customization", icon: <PlayCircle className="w-7 h-7" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="w-7 h-7" /> },
  ];

  return (
    <div
      className={`bg-black text-white flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-64"} hidden sm:flex`}
    >
      {!collapsed && (
        <div className="flex flex-col items-center my-8">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-3xl">
            {data.fullname.charAt(0)}
          </div>
          <h2 className="text-xl mt-4">{data.fullname}</h2>
          <p className="text-gray-400">@{data.username}</p>
        </div>
      )}

      <nav className={`flex flex-col gap-3 mt-6 px-2 ${collapsed ? "items-center" : ""}`}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex items-center gap-4 px-3 py-3 rounded-lg transition-all
              ${isActive ? "bg-[#1f1f1f] text-white" : "text-gray-400 hover:bg-[#1f1f1f]"}
            `
            }
          >
            <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
            {!collapsed && <span className="text-lg">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
