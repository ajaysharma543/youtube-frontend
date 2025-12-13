import React, { useEffect, useState } from "react";
import authApi from "../../api/userapi";
import Playlists from "../dashboard/playlistshow/playlist";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import { useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, Delete, Trash } from "lucide-react";
import Watchlater from "./playlistshow/watchlater";
import Liked from "./liked";
import likeApi from "../../api/like";
import { useNavigate } from "react-router-dom";

function Mianyou() {
  const [history, setHistory] = useState([]);
  const { data: user } = useSelector((state) => state.user);
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4); // lg and above
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3); // md
      } else {
        setItemsToShow(2); // below md
      }
    };

    updateCount(); // set on load
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authApi.getwatchhistory();
        const limited = res.data.data
          .slice(-itemsToShow) // responsive count
          .reverse();

        setHistory(limited);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [itemsToShow]);

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
  const latestFour = Array.isArray(list)
    ? list.slice(-itemsToShow).reverse()
    : [];
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
  const latestlikes = liked.slice(-itemsToShow).reverse();

  if (loading)
    return (
      <p className="text-black text-center py-4">Loading liked videos...</p>
    );
  return (
    <div>
      <div
        className="flex items-center gap-4 mb-6 mt-5 pb-4 cursor-pointer"
        onClick={() => navigate(`/c/${user.username}`)}
      >
        <img
          src={user?.avatar?.url || "/default-avatar.png"}
          alt={user?.fullname}
          className="w-30 h-30 rounded-full object-cover"
        />

        <div>
          <p className="text-black text-lg font-semibold">{user?.fullname}</p>
          <div className="flex">
            <p className="text-black text-sm">@{user?.username}</p>

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
        <h1 className="text-black text-xl font-semibold mb-4">Watch History</h1>
        <button className="hover:bg-gray-700 hover:text-white px-7 py-2 text-black rounded-2xl">
          see all
        </button>
      </div>
     <div className="grid grid-cols-2 p-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
  {history.map((v) => (
    <div
      key={v._id}
      className="cursor-pointer relative shadow-2xl  rounded-2xl w-full"
      onClick={() => handleVideoClick(v._id)}
    >
      {/* Thumbnail */}
      <div className="relative w-full">
        <img
          src={v.thumbnail?.url}
          alt={v.title}
          className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-xl"
        />

        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(v.duration)}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex gap-3 p-2 rounded-2xl bg-gray-200 mt-3">
        <img
          src={v.owner?.avatar?.url || "/default-avatar.png"}
          alt={v.owner?.fullname}
          className="w-9 h-9 rounded-full object-cover"
        />

        <div>
          <p className="text-black font-semibold text-sm line-clamp-2">
            {v.title}
          </p>

          <p className="text-black text-xs mt-1">{v.owner?.fullname}</p>

          <p className="text-black text-xs">
            {v.views} views • {getTimeAgo(v.createdAt)}
          </p>
        </div>
      </div>

      {/* Three Dots Dropdown */}
      <div
        className="absolute bottom-2 right-2 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <Playlist video={v}>
          <button
            onClick={() => removeFromHistory(v._id)}
            className="w-full flex text-left justify-center px-4 py-2 rounded-xl hover:bg-white text-black"
          >
            <Delete size={18} />
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
        <h1 className="text-black text-xl font-semibold">Your Playlists</h1>
        <button className="hover:bg-gray-700 hover:text-white px-7 text-black rounded-2xl">see all</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 p-2 lg:grid-cols-4 gap-4">
        {latestFour.map((p) => (
          <Playlists key={p._id} data={p} />
        ))}
      </div>
      <div
        className="flex justify-between mt-10 mb-4 cursor-pointer"
        onClick={() => navigate("/liked")}
      >
        <h1 className="text-black text-xl font-semibold">Liked Videos</h1>
        <button className="hover:bg-gray-700 hover:text-white px-7 text-black rounded-2xl">see all</button>
      </div>
      <div className="grid grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestlikes.map((video) => (
          <div
            key={video._id}
            onClick={() => handleVideoClick(video._id)}
            className="  shadow-lg rounded-2xl hover:scale-105 transform transition-all cursor-pointer overflow-visible"
          >
            <div className="w-full relative rounded-2xl h-48 bg-gray-200 overflow-hidden">
              <img
                src={video.thumbnail?.url || "/default-thumbnail.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {typeof video.duration === "number" && (
                <span className="absolute bottom-0 right-0 bg-black text-white bg-opacity-80 text-xs px-2 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>

            <div className="p-4 relative">
              <h3 className="text-black font-semibold text-base truncate">
                {video.title}
              </h3>

              <p className="text-black text-sm mt-1">
                {video.views ?? 0} views •{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </p>

              <div className="absolute bottom-3 text-black right-0 z-50">
                <Playlist video={video}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removelike(video._id);
                    }}
                    className="w-full flex items-center text-left hover:bg-white rounded-xl text-black px-4 py-2"
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
        <h1 className="text-black text-xl font-semibold ">Watch Later</h1>
        <button className="hover:bg-gray-700 hover:text-white text-black px-7  rounded-2xl">see all</button>
      </div>
      <div className="p-0">
        <Watchlater itemsToShow={itemsToShow} />
      </div>
    </div>
  );
}

export default Mianyou;
