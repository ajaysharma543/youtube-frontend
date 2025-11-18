import React, { useEffect, useState } from "react";
import VideoApi from "../../api/videoapi";
import { MoreVertical } from "lucide-react";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import { useNavigate } from "react-router-dom";

function Showallvideos({ userId, limit, sortBy, sortType }) {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const res = await VideoApi.getallvideos({
          userId,
          limit,
          sortBy,
          sortType,
        });
        setVideos(res.data.data.docs || []);
        console.log(res.data.data);
      } catch (err) {
        console.log("Error:", err);
      }
    };
    fetchUserVideos();
  }, [userId, limit, sortBy, sortType]);

  const displayedVideos = videos;

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now - created) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, sec] of Object.entries(intervals)) {
      const count = Math.floor(diff / sec);
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {displayedVideos.map((video) => (
        <div
          key={video._id}
          onClick={() => handleVideoClick(video._id)}
          className="bg-[#0f0f0f] cursor-pointer rounded-xl p-1 hover:bg-[#181818] transition-all relative"
        >
          <div className="relative">
            <img
              src={video?.thumbnail?.url || "/default-thumb.jpg"}
              className="w-full h-32 object-cover rounded-lg"
            />

            <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </span>
          </div>

          <div className="mt-3 px-1">
            <h3 className="text-white font-semibold  text-md truncate">
              {video.title}
            </h3>

            <p className="text-gray-400 text-xs mt-1">
              {video.views} views · {getTimeAgo(video.createdAt)}
            </p>
          </div>

          <div className="absolute bottom-2 right-2 text-sm">
            <Playlist video={video} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Showallvideos;
