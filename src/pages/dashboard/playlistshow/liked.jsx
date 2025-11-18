import React, { useEffect, useState } from "react";
import likeApi from "../../../api/like";
import { useNavigate } from "react-router-dom";

function Liked() {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  if (loading) {
    return (
      <p className="text-white text-center py-4">Loading liked videos...</p>
    );
  }

  if (!liked.length) {
    return <p className="text-white text-center py-4">No liked videos yet!</p>;
  }

  const latestVideo = liked[0];

  return (
    <div className=" py-2">
      {/* Latest liked video card */}
      <div className="flex flex-col items-start justify-start gap-2 bg-black rounded-2xl relative w-72 mx-auto">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden flex-shrink-0">
          {latestVideo.thumbnail?.url ? (
            <img
              src={latestVideo.thumbnail.url}
              alt={latestVideo.title}
              className="w-full h-full relative object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl">
              🎵
            </div>
          )}
          <p className=" absolute right-1 bottom-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
            {liked.length} videos
          </p>
        </div>

        <div className="flex flex-col w-full px-2 pb-2">
          <h3 className="text-white font-semibold text-md truncate">
            {latestVideo.title}
          </h3>
          <p className="text-white   truncate">Liked videos</p>
          <div className="absolute bottom-10 right-1 text-white text-xl cursor-pointer">
            ⋮
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {new Date(latestVideo.createdAt).toLocaleDateString()}
          </p>
          <p className="text-white text-sm mt-1 cursor-pointer hover:underline">
            View video
          </p>
        </div>
      </div>
    </div>
  );
}

export default Liked;
