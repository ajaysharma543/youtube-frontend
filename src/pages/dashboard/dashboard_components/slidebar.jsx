import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  History,
  Home,
  Menu,
  PlayCircleIcon,
  Settings,
  ThumbsUp,
  User,
  Users,
  Video,
  Watch,
  Youtube,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import authApi from "../../../api/userapi";

const Sidebar = ({ collapse, setMobileOpen, mobileOpen, isTablet }) => {
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
    { name: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    {
      name: "Subscriptions",
      icon: <Users className="w-5 h-5" />,
      path: "/subscriptions",
    },
    { name: "You", icon: <User className="w-5 h-5" />, path: "/mainyou" },
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

  const allowedTabletItems = ["Home", "Subscriptions", "Settings", "You"];

  return (
    <>
      <aside>
        <div
          className={`hidden md:flex flex-col fixed 
      ${collapse ? "w-23 p-2" : "w-64 p-6"}
      h-screen bg-black text-white  
      transition-all duration-300 overflow-y-auto scrollbar-hide z-50
    `}
        >
          <nav className="flex flex-col gap-1 text-white pb-13">
            {navItems
              .filter((item) => {
                // 1️⃣ MOBILE — show all
                if (mobileOpen) return true;

                // 2️⃣ TABLET — show ONLY allowed items
                if (isTablet) return allowedTabletItems.includes(item.name);

                // 3️⃣ DESKTOP collapsed — show ONLY allowed items
                if (collapse) return allowedTabletItems.includes(item.name);

                // 4️⃣ DESKTOP expanded — show ALL items
                return true;
              })
              .map((item) => (
                <React.Fragment key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-start text-md px-2 py-1.5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? isTablet
                            ? "bg-transparent"
                            : "bg-[#1c1c1c] text-white shadow-md"
                          : "hover:text-white hover:bg-[#1c1c1c]"
                      }`
                    }
                  >
                    <div
                      className={`flex p-1 gap-2 w-full
    ${
      collapse
        ? "flex-col items-center justify-center text-center  mb-2 mt-1"
        : "flex-row items-center"
    }`}
                    >
                      {item.icon}

                      {(!collapse ||
                        isTablet ||
                        mobileOpen ||
                        (collapse &&
                          allowedTabletItems.includes(item.name))) && (
                        <span className="whitespace-nowrap text-center text-xs">
                          {item.name}
                        </span>
                      )}
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
                    <div
                      className={` ${
                        isTablet ||
                        (collapse && allowedTabletItems.includes(item.name))
                          ? "border-none"
                          : "border-b border-gray-700 my-4"
                      }`}
                    ></div>
                  )}
                  {item.name === "Liked-videos" && (
                    <div className="border-b border-gray-700 my-4"></div>
                  )}
                </React.Fragment>
              ))}
          </nav>
        </div>
        <div
          className={`md:hidden fixed top-0 left-0 h-full w-60 bg-black text-white p-6 
      transition-transform duration-300 z-50
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white text-xl mb-6"
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <Menu />
              <Youtube className="text-red-600 w-8 h-8" />
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Tube<span className="text-red-600">Hub</span>
              </h1>{" "}
            </div>
          </button>
          <nav className="flex flex-col gap-1 text-white pb-13">
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
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
                    {(isTablet || !collapse || mobileOpen) && (
                      <span className="whitespace-nowrap">{item.name}</span>
                    )}
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
                          onClick={() => setMobileOpen(false)}
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
        </div>
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-trasnparent bg-opacity-50 md:hidden z-40"
          />
        )}
        <div className="hidden max-sm:flex fixed bottom-0 left-0 w-full bg-black text-white border-t border-gray-800 z-50 justify-between px-6 py-3">
          {navItems
            .filter((item) => allowedTabletItems.includes(item.name))
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center text-xs pl-3 pr-3 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`
                }
              >
                {item.icon}
                <span className="text-[10px] mt-1">{item.name}</span>
              </NavLink>
            ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
