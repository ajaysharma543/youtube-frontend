import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserVideos,
  fetchVideossubs,
} from "../../../redux/features/fetchvideoslice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserVideos());
    dispatch(fetchVideossubs());
  }, [dispatch]);
  const {
    videos = [],
    stats = {},
    loading,
  } = useSelector((state) => state.videos);
  console.log("video",videos);
  console.log("stasts",stats);
  

  const publishedVideos = videos
    .filter((v) => v.isPublished === true)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const latestVideo = publishedVideos.length ? publishedVideos[0] : null;

  return (
    <div className="min-h-screen p-10 max-[640px]:p-4 max-[640px]:pb-10 max-[640px]:pt-7 max-[400px]:pt-3 max-[400px]:p-0">
      <h1 className="text-3xl font-bold text-white mb-6">Channel Dashboard</h1>

      <div className="flex gap-6 flex-col md:flex-row ">
        <div className="flex-1 bg-[#1E1E1E] p-6  rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-white font-semibold text-xl mb-4">
            Latest YouTube Short Performance
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : latestVideo ? (
            <>
              <div className="relative w-full h-60 overflow-hidden rounded-xl mb-4">
                <img
                  src={latestVideo.thumbnail?.url || ""}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-lg font-bold text-white truncate">
                    {latestVideo.title || "Untitled"}
                  </h3>
                </div>
              </div>

              <div className="text-gray-300 mb-4 space-y-2">
                <p>
                  <span className="font-medium text-white">Uploaded:</span>{" "}
                  {latestVideo.createdAt
                    ? new Date(latestVideo.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">total Likes</p>
                  <p className="text-gray-300">{stats?.totallikes || 0}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">total Views</p>
                  <p className="text-gray-300">{stats?.totalviews || 0}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">
                    total Likes Percentage
                  </p>
                  <p className="text-gray-300">
                    {stats?.likePercentage?.toFixed(2) || 0}%
                  </p>
                </div>

                <button
                  className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  comments : {stats.totalcomments || 0}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No videos found</p>
          )}
        </div>

        {/* Channel Stats Section */}
        <div className="flex-1 bg-[#1E1E1E] p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-white font-semibold text-xl mb-4">
            Channel Analytics
          </h2>

          <div className="mb-4">
            <p className="text-white font-medium mb-2">Current Subscribers:</p>
            <p className="text-gray-300">{stats?.totalSubscribers || 0}</p>
          </div>

          <h3 className="text-white font-semibold mb-2">Summary of Videos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-white">Videos</p>
              <p className="text-gray-300">{stats?.totalVideos || 0}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-white">Views</p>
              <p className="text-gray-300">{stats?.totalviews || 0}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Go to Channel Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
