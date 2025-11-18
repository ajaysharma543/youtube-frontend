import React, { useEffect } from "react";
import { Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserVideos } from "../../redux/features/fetchvideoslice";
import { useNavigate } from "react-router-dom";

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1)
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

function ShowAllVideos() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading } = useSelector((state) => state.videos);
  const publishedVideos = videos.filter((v) => v.isPublished);
  useEffect(() => {
    dispatch(fetchUserVideos());
  }, [dispatch]);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-lg text-center mt-10">
        Loading videos...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-gray-400 text-lg text-center mt-10">
        No published videos found.
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-3">
      {publishedVideos.map((v) => (
        <div
          key={v._id}
          onClick={() => handleVideoClick(v._id)}
          className="from-gray-900 via-black cursor-pointer to-gray-900 rounded-2xl overflow-hidden hover:shadow-red-600/20"
        >
          <div className="relative group">
            <img
              src={v.thumbnail?.url}
              alt={v.title}
              className="w-full h-48 object-cover rounded-b-2xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Play className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-white font-semibold text-lg truncate">
              {v.title}
            </h3>
            <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
              <span>{v.views || 0} views</span>
              <span>{timeAgo(v.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowAllVideos;
