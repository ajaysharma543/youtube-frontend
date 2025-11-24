import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Playlist from "./playlist/playlist";
// import { fetchCurrentUser } from "../../redux/features/userdetailsslice";

const VideoCard = ({ video, onSelect }) => {
  //   const navigate = useNavigate();
  const [isloading] = useState(false);
  const { loading } = useSelector((state) => state.user);
  // const dispatch = useDispatch()

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
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInSeconds = Math.floor((now - created) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / seconds);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const uploadTime = getTimeAgo(video.createdAt);

  return (
    <>
      {/* 🔄 Loading Overlay */}
      {isloading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg">Redirecting to Signup...</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <div className="relative group w-[full] lg:w-[400px] ">
        <div
          className="cursor-pointer bg-black rounded-2xl overflow-hidden"
          onClick={() => onSelect(video._id)}
        >
          <div
            className="
  flex flex-col 
  [@media(min-width:1014px)]:flex-row 
  gap-3 
  p-3
"
          >
            {" "}
            <div className="relative flex-shrink-0">
              <img
                src={video.thumbnail.url}
                alt={video.title}
                className="w-40 h-28 object-cover rounded-2xl"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <h3 className="text-white font-semibold text-md break-words leading-snug line-clamp-2">
                {video.title}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <img
                  src={video.owner?.avatar?.url || "/default-avatar.png"}
                  alt={video.owner?.username}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-white text-xs truncate">
                  {video.owner?.username}
                </span>
              </div>

              <div className="flex gap-2 text-gray-400 text-xs mt-1">
                <span>{video.views} views</span>
                <span>·</span>
                <span>{uploadTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-2 z-50">
          <Playlist video={video} />
        </div>
      </div>
    </>
  );
};

export default VideoCard;
