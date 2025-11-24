import React, { useEffect, useState } from "react";
import authApi from "../../api/userapi";
import Playlists from "../dashboard/playlistshow/playlist";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import { useSelector } from "react-redux";
import { Delete, Trash } from "lucide-react";
import Watchlater from "./playlistshow/watchlater";
import Liked from "./liked";
import likeApi from "../../api/like";
import { useNavigate } from "react-router-dom";

function Mianyou() {
  const [history, setHistory] = useState([]);
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authApi.getwatchhistory();
        const limited = res.data.data.slice(-4).reverse();
        setHistory(limited);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);
  const { list = [] } = useSelector((state) => state.playlist || {});
  // const limitedPlaylist = list.slice(0,4);

  const removeFromHistory = async (videoId) => {
    try {
      await authApi.deletewatchhistory(videoId);
      setHistory((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0)
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
  const latestFour = Array.isArray(list) ? list.slice(-4).reverse() : [];
  // console.log("LIST VALUE:", list);

  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        setLoading(true);
        const res = await likeApi.getLikedVideos();
        const likedVideos = res.data.data.map((item) => item.likedvideo);
        likedVideos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLiked(likedVideos);
        // console.log(likedVideos);
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  const removelike = async (videoId) => {
    try {
      const res = await likeApi.toggleVideoLike(videoId);
      // console.log(res.data.data);

      setLiked((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Error removing liked video:", err);
    }
  };
  const latestlikes = liked.slice(-4).reverse();

  if (loading)
    return (
      <p className="text-white text-center py-4">Loading liked videos...</p>
    );
  return (
    <div>
      <div
        className="flex items-center gap-4 mb-6  pb-4 cursor-pointer"
        onClick={() => navigate(`/c/${user.username}`)}
      >
        <img
          src={user?.avatar?.url || "/default-avatar.png"}
          alt={user?.fullname}
          className="w-30 h-30 rounded-full object-cover"
        />

        <div>
          <p className="text-white text-lg font-semibold">{user?.fullname}</p>
          <div className="flex">
            <p className="text-gray-400 text-sm">@{user?.username}</p>

            <p className="text-blue-400 pl-2 text-sm cursor-pointer hover:underline">
              View Channel
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex justify-between mt-10 cursor-pointer mb-4"
        onClick={() => navigate("/history")}
      >
        <h1 className="text-white text-xl font-semibold mb-4">Watch History</h1>
        <button className="hover:bg-gray-700 px-7 py-2 rounded-2xl">
          see all
        </button>
      </div>
      <div className="grid grid-cols-4">
        {history.map((v) => (
          <div
            key={v._id}
            className="cursor-pointer relative w-[97%]"
            onClick={() => handleVideoClick(v._id)}
          >
            <div className="relative w-[94%]">
              <img
                src={v.thumbnail?.url}
                alt={v.title}
                className="w-full h-35 object-cover rounded-lg"
              />

              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(v.duration)}
              </span>
            </div>

            <div className="flex gap-3 mt-3">
              <img
                src={v.owner?.avatar?.url || "/default-avatar.png"}
                alt={v.owner?.fullname}
                className="w-9 h-9 rounded-full object-cover"
              />

              <div>
                <p className="text-white font-semibold text-sm line-clamp-2">
                  {v.title}
                </p>

                <p className="text-gray-300 text-xs mt-1">
                  {v.owner?.fullname}
                </p>

                <p className="text-gray-500 text-xs">
                  {v.views} views • {getTimeAgo(v.createdAt)}
                </p>
              </div>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 right-7 z-50"
            >
              <Playlist video={v}>
                <button
                  onClick={() => removeFromHistory(v._id)}
                  className=" w-full flex text-left justify-center px-4 py-2 hover:bg-gray-700 text-white"
                >
                  <Delete />
                  Remove
                </button>
              </Playlist>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex justify-between mt-10 mb-4 cursor-pointer"
        onClick={() => navigate("/playlist")}
      >
        <h1 className="text-white text-xl font-semibold">Your Playlists</h1>
        <button className="hover:bg-gray-700 px-7  rounded-2xl">see all</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {latestFour.map((p) => (
          <Playlists key={p._id} data={p} />
        ))}
      </div>
      <div
        className="flex justify-between mt-10 mb-4 cursor-pointer"
        onClick={() => navigate("/liked")}
      >
        <h1 className="text-white text-xl font-semibold">Liked Videos</h1>
        <button className="hover:bg-gray-700 px-7  rounded-2xl">see all</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestlikes.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video._id)}
            className=" rounded-xl shadow-lg hover:scale-105 transform transition-all cursor-pointer overflow-visible"
          >
            {/* Thumbnail */}
            <div className="w-full relative h-48 bg-black overflow-hidden">
              <img
                src={video.thumbnail?.url || "/default-thumbnail.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {typeof video.duration === "number" && (
                <span className="absolute bottom-0 right-0 bg-black bg-opacity-80 text-xs px-2 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-4 relative">
              <h3 className="text-white font-semibold text-base truncate">
                {video.title}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                {video.views ?? 0} views •{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </p>

              {/* 3-DOTS MENU */}
              <div className="absolute bottom-3 right-0 z-50">
                <Playlist video={video}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removelike(video._id);
                    }}
                    className="w-full flex items-center text-left hover:bg-gray-700 text-white px-4 py-2"
                  >
                    <Trash className="mr-2 w-5 h-5" />
                    Remove
                  </button>
                </Playlist>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex justify-between mt-10 mb-4 cursor-pointer"
        onClick={() => navigate("/watchlater")}
      >
        <h1 className="text-white text-xl font-semibold ">Watch Later</h1>
        <button className="hover:bg-gray-700 px-7  rounded-2xl">see all</button>
      </div>
      <div className="p-0">
        <Watchlater />
      </div>
    </div>
  );
}

export default Mianyou;
