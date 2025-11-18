import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/userapi";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import { Delete } from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authApi.getwatchhistory();
        setHistory(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);
  const removeFromHistory = async (videoId) => {
    try {
      await authApi.deletewatchhistory(videoId);
      setHistory((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      console.error(error);
    }
  };
  const handleClearAll = async () => {
    try {
      await authApi.deleteallwatchhistory();
      setHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const truncateDescription = (desc, maxWords = 100) => {
    if (!desc) return "";
    const words = desc.split(" ");
    if (words.length <= maxWords) return desc;
    return words.slice(0, maxWords).join(" ") + " ...";
  };

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  const groupByDate = (videos) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const grouped = { Today: [], Yesterday: [], Earlier: [] };

    videos.forEach((video) => {
      const watchedDate = new Date(video.createdAt);
      if (watchedDate.toDateString() === today.toDateString()) {
        grouped.Today.push(video);
      } else if (watchedDate.toDateString() === yesterday.toDateString()) {
        grouped.Yesterday.push(video);
      } else {
        grouped.Earlier.push(video);
      }
    });

    return grouped;
  };
  const filteredHistory = history.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedHistory = groupByDate(filteredHistory);

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-white">Watch History</h1>

      {history.length === 0 ? (
        <p className="text-black">No watch history found.</p>
      ) : (
        <div className="flex w-full gap-8">
          <div className="flex flex-col gap-8 w-[70%]">
            {Object.entries(groupedHistory).map(
              ([group, videos]) =>
                videos.length > 0 && (
                  <div key={group}>
                    <h2 className="text-white font-semibold text-lg mb-4">
                      {group}
                    </h2>

                    <div className="flex flex-col gap-6 w-full">
                      {videos.map((video) => (
                        <div
                          key={video._id}
                          onClick={() => handleVideoClick(video._id)}
                          className="bg-black flex overflow-visible cursor-pointer transition-all rounded-2xl hover:bg-black relative"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-52 aspect-video rounded-2xl overflow-hidden">
                            <img
                              src={video.thumbnail.url}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                              {formatDuration(video.duration)}
                            </div>
                          </div>

                          {/* Video info */}
                          <div className="p-4 flex flex-col gap-2 w-full">
                            <h3 className="text-white font-semibold text-lg truncate">
                              {video.title}
                            </h3>

                            <div className="flex gap-2 text-gray-300 text-sm">
                              <p>{video.owner?.fullname}</p>
                              <span>·</span>
                              <p>{video.views} views</p>
                            </div>

                            {video.description && (
                              <p className="text-gray-400 text-sm mt-1">
                                {truncateDescription(video.description, 100)}
                              </p>
                            )}
                          </div>

                          {/* 3 Dots Menu */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 z-50"
                          >
                            <Playlist video={video}>
                              <button
                                onClick={() => removeFromHistory(video._id)}
                                className=" w-full flex text-left justify-center px-4 py-2 hover:bg-gray-700 text-white"
                              >
                                <Delete />
                                Remove
                              </button>
                            </Playlist>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="w-[30%] flex flex-col gap-6 text-white">
            <input
              type="text"
              placeholder="Search watch history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1e1e1e] text-white outline-none border border-gray-700"
            />

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="w-full py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
            >
              Clear All Watch History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
