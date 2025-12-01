import React, { useEffect } from "react";
import { Play, Edit, Trash2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserVideos } from "../../../redux/features/fetchvideoslice";
import VideoApi from "../../../api/videoapi";
import Smallcontent from "./smallcontent";

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
    <>
      <div className="flex flex-col min-h-screen max-[640px]:hidden bg-black text-white">
        {/* TOP HEADER */}
        <header className="py-4 px-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Channel Content</h1>
        </header>

        {/* SUB HEADER */}
        <header className="py-3 px-4 border-b border-gray-800 bg-[#111]">
          <h2 className="text-lg font-semibold">Videos</h2>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-3 py-4">
          {loading ? (
            <p className="text-center text-gray-400">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-400">No videos found.</p>
          ) : (
            <div className="w-full overflow-x-auto custom-scroll pb-6">
              {/* TABLE HEAD */}
              <div
                className="
            grid min-w-[700px]
            grid-cols-[40px_100px_1fr_70px_100px_90px_70px]
            text-gray-400 text-sm font-semibold border-b border-gray-700 pb-2
          "
              >
                <span></span>
                <span>Thumbnail</span>
                <span>Title</span>
                <span>Edit</span>
                <span>Created</span>
                <span>Publish</span>
                <span>Delete</span>
              </div>

              {/* TABLE ROWS */}
              {videos.map((v) => (
                <div
                  key={v._id}
                  className="
              grid min-w-[700px]
              grid-cols-[40px_100px_1fr_70px_100px_90px_70px]
              bg-[#181818] hover:bg-[#202020] rounded-lg 
              p-3 gap-3 items-center mt-2
            "
                >
                  {/* CHECKBOX */}
                  <div className="flex justify-center">
                    <input type="checkbox" className="w-4 h-4 accent-red-600" />
                  </div>

                  {/* THUMBNAIL */}
                  <img
                    src={v.thumbnail?.url}
                    className="w-20 h-14 object-cover rounded-md"
                    alt=""
                  />

                  {/* TITLE */}
                  <div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {v.description || "No description"}
                    </p>
                  </div>

                  {/* EDIT */}
                  <button
                    onClick={() => navigate(`/edit_video/${v._id}`)}
                    className="flex justify-center text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={16} />
                  </button>

                  {/* CREATED AT */}
                  <div className="text-sm text-gray-300 text-center">
                    {timeAgo(v.createdAt)}
                  </div>

                  {/* PUBLISH TOGGLE */}
                  <label className="flex justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.isPublished}
                      onChange={() => handleToggle(v._id)}
                      className="peer sr-only"
                    />
                    <div
                      className="
                w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-green-500 relative
                after:absolute after:left-[2px] after:top-[2px]
                after:w-5 after:h-5 after:bg-white after:rounded-full 
                after:transition-all peer-checked:after:translate-x-full
              "
                    ></div>
                  </label>

                  {/* DELETE */}
                  <button
                    onClick={() => deletes(v._id)}
                    className="flex justify-center text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6 sm:justify-end justify-center">
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold w-full sm:w-auto justify-center"
            >
              <Upload size={18} /> Upload Video
            </button>
          </div>
        </main>
      </div>

      <div className="sm:hidden">
        <Smallcontent />
      </div>
    </>
  );
}

export default ShowAllVideos;
