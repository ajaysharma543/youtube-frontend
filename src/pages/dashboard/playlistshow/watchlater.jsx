import React, { useEffect, useState } from "react";
import WatchApi from "../../../api/watchlater";
import { useSelector } from "react-redux";
import Playlist from "../../playvideo_dahboard/playlist/playlist";
import { useNavigate } from "react-router-dom";
import { Delete } from "lucide-react";

function Watchlater() {
  const { data: user } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWatchLater = async () => {
      setLoading(true);
      try {
        const res = await WatchApi.getwatchlater();
        setVideos(res.data.data || []);
      } catch (error) {
        console.error("Error fetching watch later videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchWatchLater();
  }, [user]);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0)
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const deletewatchlater = async (videoId) => {
    try {
      const res = await WatchApi.removeFromWatchLater(videoId);
      console.log("res", res.data.data);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading Watch Later videos...
      </div>
    );

  if (!videos.length)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        No videos in Watch Later
      </div>
    );

  return (
    <div className="p-3 text-white overflow-visible scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video._id)}
            className="rounded-xl w-70 shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer flex flex-col relative overflow-visible z-20"
          >
            {/* Thumbnail */}
            <div className="w-full h-48 relative bg-black overflow-hidden rounded-t-xl">
              <img
                src={video.thumbnail?.url || "/default-thumbnail.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>

            {/* Details */}
            <div className="p-4 relative">
              <h2 className="text-lg font-semibold truncate text-white">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {video.description}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                👁 {video.views || 0} views
              </p>

              {/* Three dots menu */}
              <div className="absolute bottom-0 right-0 z-[999]">
                <Playlist video={video}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletewatchlater(video._id);
                    }}
                    className="w-full flex items-center text-left hover:bg-gray-700 text-white px-4 py-2"
                  >
                    <Delete className="mr-2 w-5 h-5" />
                    Remove
                  </button>
                </Playlist>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlater;
