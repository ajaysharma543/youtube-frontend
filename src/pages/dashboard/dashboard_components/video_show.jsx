import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../../../redux/features/userdetailsslice";
import { useDispatch, useSelector } from "react-redux";
import Playlist from "../../playvideo_dahboard/playlist/playlist";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [isloading, setLoading] = useState(false);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleClick = async () => {
    setLoading(true);
    try {
      const userData = await dispatch(fetchCurrentUser());
      if (userData) {
        setLoading(false);
        navigate(`/video/${video._id}`);
      }
    } catch (error) {
      setLoading(true);
      console.error("User not logged in:", error);
      navigate("/signup");
    } finally {
      setLoading(false);
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

      <div className="relative group cursor-pointer bg-black rounded-2xl">
        <div
          className="absolute inset-0 bg-[#3b3333] rounded-2xl scale-100 opacity-0 
                  group-hover:scale-106 group-hover:opacity-100 
                  transition-all duration-700 ease-in-out pointer-events-none"
        ></div>

        <div
          onClick={handleClick}
          className="relative pb-4 p-0 bg-black rounded-2xl transition-all duration-700 ease-in-out"
        >
          <img
            src={video.thumbnail.url}
            alt={video.title}
            className="w-full h-55 sm:h-65 md:h-68 lg:h-50 xl:h-60 2xl:h-76 object-cover rounded-t-2xl"
          />
          <div className="p-3">
            <h3 className="text-white font-semibold text-lg truncate">
              {video.title}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <img
                src={video.owner?.avatar?.url}
                alt={video.owner?.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-gray-300 text-sm">
                {video.owner?.username}
              </span>
            </div>

            <div className="flex pl-2 items-center mt-3 text-gray-400 text-sm">
              <span className="pl-2">{video.views} views ·</span>
              <span className="pl-2">{uploadTime}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-50">
          <Playlist video={video} />
        </div>
      </div>
    </>
  );
};

export default VideoCard;
