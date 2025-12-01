import React from "react";
import { Edit, Trash2, Upload } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoApi from "../../../api/videoapi";
import { fetchUserVideos } from "../../../redux/features/fetchvideoslice";

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

function Smallcontent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading } = useSelector((state) => state.videos);

  const deletes = async (id) => {
    await VideoApi.deletevideo(id);
    dispatch(fetchUserVideos());
  };

  const handleToggle = async (id) => {
    await VideoApi.publishvideo(id);
    dispatch(fetchUserVideos());
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen sm:hidden">
      <h2 className="text-xl font-bold mb-4">Your Videos</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No videos found.</p>
      ) : (
        <div className="space-y-4">
          {videos.map((v) => (
            <div
              key={v._id}
              className="bg-[#151515] p-3 rounded-lg shadow-sm border border-gray-800"
            >
              {/* Thumbnail */}
              <img
                src={v.thumbnail?.url}
                className="w-full h-40 object-cover rounded-lg"
                alt=""
              />

              {/* Title + description */}
              <div className="mt-2">
                <h3 className="font-semibold text-lg">{v.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {v.description || "No description"}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  {timeAgo(v.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => navigate(`/edit_video/${v._id}`)}
                  className="text-blue-400 flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </button>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={v.isPublished}
                    onChange={() => handleToggle(v._id)}
                    className="peer sr-only"
                  />
                  <div
                    className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-green-500 relative
                    after:absolute after:left-[2px] after:top-[2px]
                    after:w-4 after:h-4 after:bg-white after:rounded-full 
                    peer-checked:after:translate-x-full after:transition-all"
                  ></div>
                </label>

                <button
                  onClick={() => deletes(v._id)}
                  className="text-red-500 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={() => navigate("/upload")}
        className="mt-6 w-full bg-red-600 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center"
      >
        <Upload size={18} /> Upload Video
      </button>
    </div>
  );
}

export default Smallcontent;
