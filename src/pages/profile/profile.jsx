import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Showallvideos from "./showallvideos";
import Showallplaylist from "./showallplaylist";

function Profile() {
  const { data, loading } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("videos");
  const navigate = useNavigate();

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (!data)
    return (
      <p className="text-white text-center mt-10">
        No user found. Please log in.
      </p>
    );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-6 bg-black">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          {/* Avatar */}
          <div className="w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center rounded-full bg-gray-800 text-5xl sm:text-6xl font-bold shadow-lg">
            {data?.avatar.url ? (
              <img
                src={data.avatar.url}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>
                {data?.fullname ? data.fullname.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>

          {/* Username + Buttons */}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold mb-1">{data.fullname}</h2>
            <p className="text-gray-400 text-lg mt-3">@{data.username}</p>

            <div className="flex gap-3 mt-4 flex-wrap justify-center sm:justify-start">
              <button
                className="bg-gray-700 hover:bg-gray-800 px-5 py-2 rounded-full font-semibold transition"
                onClick={() => navigate("/channel-customize")}
              >
                Customize Channel
              </button>

              <button
                className="bg-gray-700 hover:bg-gray-800 px-5 py-2 rounded-full font-semibold transition"
                onClick={() => navigate("/content")}
              >
                Manage Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex-1 bg-black flex flex-col">
        <div className="border-b border-gray-700 w-full">
          <div className="flex justify-center sm:justify-start w-full sm:w-[30%]">
            {["videos", "playlist"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center text-base sm:text-lg 
            font-semibold cursor-pointer relative py-3 sm:py-4 transition 
            ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                {activeTab === tab && (
                  <div className="absolute bottom-0 w-[80%] h-[3px] bg-white rounded-t-full transition-all duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-0">
          {activeTab === "videos" && <Showallvideos />}
          {activeTab === "playlist" && <Showallplaylist />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
