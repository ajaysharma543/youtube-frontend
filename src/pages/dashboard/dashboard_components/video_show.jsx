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
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-black mt-4 text-lg">Redirecting to Signup...</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

     <div className="relative group cursor-pointer">
  {/* Hover Glow */}
  <div
    className="absolute inset-0 rounded-2xl bg-black/5 
               opacity-0 group-hover:opacity-100 
               transition-all duration-500 pointer-events-none"
  ></div>

  {/* Card */}
  <div
    onClick={handleClick}
    className="relative bg-white rounded-2xl overflow-hidden
               shadow-md hover:shadow-xl
               transition-all duration-500 ease-in-out"
  >
    {/* Thumbnail */}
    <img
      src={video.thumbnail.url}
      alt={video.title}
            className="w-full h-60 sm:h-55 md:h-50 lg:h-50 xl:h-52 2xl:h-50 object-cover rounded-t-2xl"
    />

    {/* Content */}
    <div className="p-2 space-y-1">
   

      {/* Channel */}
      <div className="flex items-center gap-2">
        <img
          src={video.owner?.avatar?.url}
          alt={video.owner?.username}
          className="w-7 h-7 rounded-full object-cover"
        />
         <div className="flex flex-col">
            <h3 className="text-black font-semibold text-base line-clamp-2">
        {video.title}
      </h3>
        <span className="text-gray-700 text-sm">
          {video.owner?.username}
        </span>
         </div>
      </div>

      {/* Views & Time */}
      <div className="flex items-center ml-8 text-gray-600 text-xs gap-1">
        
        <span>{video.views} views</span>
        <span>•</span>
        <span>{uploadTime}</span>
      </div>
    </div>
  </div>

  {/* Playlist Icon */}
  <div className="absolute bottom-10 right-3 z-20">
    <Playlist video={video} />
  </div>
</div>

    </>
  );
};

export default VideoCard;
