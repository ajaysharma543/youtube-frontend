import React, { useEffect, useState } from "react";
import likeApi from "../../api/like";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import { useNavigate } from "react-router-dom";
import { Delete, Trash } from "lucide-react";

function Liked() {
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
        console.log(likedVideos);
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
      console.log(res.data.data);

      setLiked((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Error removing liked video:", err);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <p className="text-white text-center py-4">Loading liked videos...</p>
    );
  if (!liked.length)
    return <p className="text-white text-center py-4">No liked videos yet!</p>;

  const latestVideo = liked[0];

  return (
  <>
   <div className="hidden sm:flex gap-8 p-6 bg-black min-h-screen text-white">

  {/* LEFT SIDEBAR */}
  <aside className="w-1/3 sticky top-0 self-start h-screen">
    <div className="bg-neutral-900 rounded-2xl p-4 flex flex-col gap-4 h-full">

      {/* COVER IMAGE */}
      <div className="relative w-full h-2/3 rounded-2xl overflow-hidden">
        {latestVideo.thumbnail?.url ? (
          <img
            src={latestVideo.thumbnail.url}
            alt={latestVideo.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-5xl">🎵</div>
        )}

        <span className="absolute bottom-3 left-3 bg-black/70 text-white text-sm px-3 py-1 rounded">
          {liked.length} videos
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold">Liked videos</h2>
          <h6 className="text-sm">{latestVideo.owner.username}</h6>
          <span className="text-gray-400">{latestVideo.views} views</span>
          <span className="text-gray-400 block">updated today</span>
        </div>

        <div className="flex gap-3 mt-4">
          <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
            Play all
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Shuffle
          </button>
        </div>
      </div>

    </div>
  </aside>

  {/* RIGHT SECTION */}
  <main className="w-2/3 max-h-screen overflow-y-auto scrollbar-hide pr-2">
    <div className="flex flex-col">
      {liked.map((video, idx) => (
        <div
          key={video._id}
          className="flex items-center gap-4 bg-neutral-900 rounded-2xl p-3 mb-3 cursor-pointer"
          onClick={() => handleVideoClick(video._id)}
        >
          <div className="text-gray-400 font-semibold w-6 text-right">{idx + 1}</div>

          {/* Thumbnail */}
          <div className="relative w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
            {video.thumbnail?.url ? (
              <img src={video.thumbnail.url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-2xl">🎵</div>
            )}
            {typeof video.duration === "number" && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            )}
          </div>

          {/* Video Info */}
          <div className="flex flex-col justify-center w-full">
            <h3 className="text-white font-semibold text-base line-clamp-2">{video.title}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {video.views ?? 0} views • {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Menu */}
          <div className="ml-auto relative z-50">
            <Playlist video={video}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removelike(video._id);
                }}
                className="w-full flex items-center text-left hover:bg-gray-700 text-white px-4 py-2"
              >
                <Trash className="mr-2 w-5 h-5" /> Remove
              </button>
            </Playlist>
          </div>

        </div>
      ))}
    </div>
  </main>

</div>
{/* MOBILE VERSION */}
<div className="block sm:hidden p-4 bg-black min-h-screen text-white">

  {/* Header */}
  <div className="mb-4">
    <h1 className="text-xl font-bold">Liked Videos</h1>
    <p className="text-gray-400 text-sm">{liked.length} videos</p>
  </div>

  {/* Latest Thumbnail */}
  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-800">
    {latestVideo.thumbnail?.url ? (
      <img
        src={latestVideo.thumbnail.url}
        alt={latestVideo.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
    )}

    <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 text-xs rounded">
      {liked.length} videos
    </span>
  </div>

  {/* Play buttons */}
  <div className="flex gap-3 mb-4">
    <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold w-full">
      Play all
    </button>
    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full">
      Shuffle
    </button>
  </div>

  {/* Video List */}
  <div className="flex flex-col gap-4">
    {liked.map((video, idx) => (
      <div
        key={video._id}
        className="bg-neutral-900 rounded-xl overflow-hidden cursor-pointer"
        onClick={() => handleVideoClick(video._id)}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-neutral-800">
          <img src={video.thumbnail.url} className="w-full h-full object-cover" />

          <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
          <p className="text-gray-400 text-xs mt-1">
            {video.views ?? 0} views • {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Menu */}
        <div className="absolute top-2 right-2 z-50">
          <Playlist video={video}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removelike(video._id);
              }}
              className="w-full flex items-center text-left hover:bg-gray-700 text-white px-4 py-2"
            >
              <Trash className="mr-2 w-5 h-5" /> Remove
            </button>
          </Playlist>
        </div>

      </div>
    ))}
  </div>

</div>

  </>
  );
}

export default Liked;
