import React, { useEffect, useState } from "react";
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
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import authApi from "../../../api/userapi";

const Sidebar = ({ collapse }) => {
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
        className={`hidden md:flex flex-col fixed ${
          collapse ? "w-20" : "w-64"
        } h-screen bg-black text-white p-6 
   transition-all duration-300 overflow-y-auto scrollbar-hide z-40`}
      >
        <nav className="flex flex-col gap-1 text-white pb-13">
          {navItems.map((item) => (
            <React.Fragment key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-start text-md px-2 py-1.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#1c1c1c] text-white shadow-md"
                      : "hover:text-white hover:bg-[#1c1c1c]"
                  }`
                }
              >
                <div className="flex items-center p-1 gap-2">
                  {item.icon}
                  {!collapse && <span>{item.name}</span>}
                </div>

                {!collapse && item.name === "Subscription" && (
                  <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                )}

                {!collapse && item.name === "You" && (
                  <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                )}
              </NavLink>

              {item.name === "Subscription" &&
                !collapse &&
                subscriptions.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {subscriptions.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/c/${sub.username}`}
                        className="flex items-center gap-3 w-full px-3 py-2
                    rounded-xl transition-all duration-200 text-white shadow-md hover:bg-gray-800"
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

      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 flex justify-around items-center p-2 md:hidden z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 text-lg px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-red-600 text-white shadow-md"
                  : "hover:text-red-400 hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            {!collapse && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
