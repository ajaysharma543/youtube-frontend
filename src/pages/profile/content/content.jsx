import React, { useEffect } from "react";
import { Play, Edit, Trash2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserVideos } from "../../../redux/features/fetchvideoslice";
import VideoApi from "../../../api/videoapi";

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

  useEffect(() => {
    dispatch(fetchUserVideos());
  }, [dispatch]);

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const deletes = async (videoId) => {
    try {
      await VideoApi.deletevideo(videoId);
      dispatch(fetchUserVideos());
    } catch (error) {
      console.error("Error toggling delete:", error);
    }
  };

  const handleToggle = async (videoId) => {
    try {
      await VideoApi.publishvideo(videoId);
      dispatch(fetchUserVideos());
      //  console.log(res);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col text-white bg-[#0f0f0f]">
      {/* Top Header */}
      <header className="h-[10%] flex flex-col justify-center items-start px-6">
        <h1 className="text-3xl font-bold">Channel Content</h1>
      </header>

      {/* Sub-header */}
      <header className="h-[5%] flex flex-col justify-center items-start border-b border-gray-700 px-6">
        <h1 className="text-xl font-semibold">Videos</h1>
      </header>

      {/* Main Section */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <div className="text-gray-400 text-lg text-center mt-10">
            Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-gray-400 text-lg text-center mt-10">
            No videos found.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-[50px_120px_1fr_100px_140px_120px_100px] text-gray-400 text-sm font-semibold border-b border-gray-700 pb-2">
              <span></span>
              <span>Thumbnail</span>
              <span>Title & Description</span>
              <span>Edit</span>
              <span>Created At</span>
              <span>Published</span>
              <span>Delete</span>
            </div>

            {videos.map((v) => (
              <div
                key={v._id}
                className="grid grid-cols-[50px_120px_1fr_100px_140px_120px_100px] items-center bg-[#181818] hover:bg-[#202020] transition rounded-lg p-2"
              >
                <div className="flex justify-center">
                  <input type="checkbox" className="w-4 h-4 accent-red-600" />
                </div>

                <div className="relative group">
                  <img
                    src={v.thumbnail?.url}
                    alt={v.title}
                    className="w-24 h-16 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold truncate">
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {(() => {
                      if (!v.description) return "No description available";

                      const words = v.description.trim().split(/\s+/);

                      if (words.length <= 30) {
                        return v.description;
                      }

                      const shortText = words.slice(0, 30).join(" ");
                      return shortText + " ...";
                    })()}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => navigate(`/edit_video/${v._id}`)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Edit size={18} /> Edit
                  </button>
                </div>

                <div className="text-gray-300 text-sm text-center">
                  {timeAgo(v.createdAt)}
                </div>

                <div className="flex justify-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.isPublished}
                      onChange={() => handleToggle(v._id)}
                      className="sr-only peer"
                    />
                    <div
                      className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all 
                      peer-checked:after:translate-x-full"
                    ></div>
                  </label>
                </div>

                {/* Delete */}
                <div
                  className="flex justify-center cursor-pointer"
                  onClick={() => deletes(v._id)}
                >
                  <button className="text-red-500 cursor-pointer hover:text-red-400 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition"
          >
            <Upload size={18} />
            Upload Video
          </button>
        </div>
      </main>
    </div>
  );
}

export default ShowAllVideos;
