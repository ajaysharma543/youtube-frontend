import React, { useEffect, useState } from "react";
import WatchApi from "../../../api/watchlater";
import { useSelector } from "react-redux";
import Playlist from "../../playvideo_dahboard/playlist/playlist";
import { useNavigate } from "react-router-dom";
import { Delete } from "lucide-react";

function Watchlater({ itemsToShow }) {
  const { data: user } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchLater = async () => {
      setLoading(true);
      try {
        const res = await WatchApi.getwatchlater();
        const allVideos = res.data.data;

        // Sort newest first
        const sorted = allVideos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Limit according to screen size
        const limited = sorted.slice(0, itemsToShow);

        setVideos(limited);
      } catch (error) {
        console.error("Error fetching watch later videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchWatchLater();
  }, [user, itemsToShow]); // 🔥 Re-run when screen size changes

  const handleVideoClick = (id) => navigate(`/video/${id}`);

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
      await WatchApi.removeFromWatchLater(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-8">
        Loading Watch Later videos...
      </div>
    );

  if (!videos.length)
    return (
      <div className="text-center text-gray-400 py-8">
        No videos in Watch Later
      </div>
    );

  return (
    <div className="p-3 text-white">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video._id)}
            className="rounded-xl shadow-lg hover:scale-105 transform transition-all cursor-pointer relative"
          >
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

            <div className="p-3 relative">
              <h2 className="text-sm font-semibold line-clamp-2">
                {video.title}
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                👁 {video.views || 0} views
              </p>

              <div className="absolute bottom-2 right-2">
                <Playlist video={video}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletewatchlater(video._id);
                    }}
                    className="flex items-center px-3 py-1 hover:bg-gray-700 rounded"
                  >
                    <Delete className="w-4 h-4 mr-1" />
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
