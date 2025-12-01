import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import authApi from "../../api/userapi";
import {
  ChevronRight,
  History,
  Home,
  PlayCircleIcon,
  Settings,
  ThumbsUp,
  User,
  Users,
  Video,
  Watch,
} from "lucide-react";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { data: user } = useSelector((state) => state.user);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!user?.username) return;

      const res = await authApi.getUserChannelProfile(user.username);
      setSubscriptions(res.data?.data?.mysubscribedchannels || []);
    };

    fetchSubs();
  }, [user]);
  const navItems = [
    {
      name: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    },
    {
      name: "Subscriptions",
      icon: <Users className="w-5 h-5" />,
      path: "/subscriptions",
    },
    {
      name: "You",
      icon: <User className="w-5 h-5" />,
      path: "/mainyou",
    },
    {
      name: "history",
      icon: <History className="w-5 h-5" />,
      path: "/History",
    },
    {
      name: "Playlist",
      icon: <PlayCircleIcon className="w-5 h-5" />,
      path: "/Playlist",
    },

    {
      name: "your videos",
      icon: <Video className="w-5 h-5" />,
      path: "/content",
    },
    {
      name: "watch later",
      icon: <Watch className="w-5 h-5" />,
      path: "/watchlater",
    },
    {
      name: "Liked-videos",
      icon: <ThumbsUp className="w-5 h-5" />,
      path: "/liked",
    },
    {
      name: "Subscription",
      icon: <Users className="w-5 h-5" />,
      path: "/Subscription",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 border-r border-black bg-black text-white
          transition-transform duration-300 overflow-y-auto scrollbar-hide
          w-64 p-6
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <nav className="flex flex-col gap-6 text-gray-400 mt-20">
          {navItems.map((item) => (
            <React.Fragment key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-start text-md px-2 py-0.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#1c1c1c] text-white shadow-md"
                      : "hover:text-white "
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>

                {item.name === "Subscription" && (
                  <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                )}

                {item.name === "You" && (
                  <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                )}
              </NavLink>

              {item.name === "Subscription" && subscriptions.length > 0 && (
                <div className="flex flex-col gap-1">
                  {subscriptions.map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/c/${sub.username}`}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-200 text-white shadow-md hover:bg-gray-800"
                    >
                      <div className="w-10 h-10 flex-shrink-0">
                        <img
                          src={sub.avatar?.url || "/default-profile.png"}
                          alt={sub.fullname}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      <span className="text-sm text-gray-300 font-medium truncate">
                        {sub.fullname}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {item.name === "Subscriptions" && (
                <div className="border-b border-gray-700 my-4"></div>
              )}
              {item.name === "Liked-videos" && (
                <div className="border-b border-gray-700 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
