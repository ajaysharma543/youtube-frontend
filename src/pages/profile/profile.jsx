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
      <div className="flex items-center justify-between px-10 py-8 h-[30vh] bg-black">
        <div className="flex items-start gap-6">
          <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-800 text-6xl font-bold shadow-lg">
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

          <div>
            <h2 className="text-3xl font-bold mb-1">{data.fullname}</h2>
            <p className="text-gray-400 text-lg mt-3">@{data.username}</p>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-800 cursor-pointer transition px-5 py-2 rounded-full font-semibold"
                onClick={() => navigate("/channel-customize")}
              >
                Customize Channel
              </button>
              <button
                onClick={() => navigate("/content")}
                className="bg-gray-700 hover:bg-gray-800 cursor-pointer transition px-5 py-2 rounded-full font-semibold"
              >
                Manage Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black flex flex-col">
        <div className="border-b border-gray-700 w-full">
          <div className="flex justify-start w-[30%]">
            {["videos", "playlist"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center text-lg font-semibold cursor-pointer relative py-4 transition ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                {activeTab === tab && (
                  <div className="absolute bottom-0 flex items-center w-[80%] h-[3px] bg-white rounded-t-full transition-all duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {activeTab === "videos" && <Showallvideos />}
          {activeTab === "playlist" && <Showallplaylist />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
