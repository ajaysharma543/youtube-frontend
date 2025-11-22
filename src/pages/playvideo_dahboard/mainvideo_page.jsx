import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoApi from "../../api/videoapi";
import VideoDetails from "./go_to_video";
import { useSelector } from "react-redux";
import Subscriber from "./subscriber";
import Likes from "./likes";
import Comments from "./comment/comments";
import Playlist from "./playlist/playlist";

function Mainvideo_page() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [commentVideoId, setcommentVideoId] = useState(videoId);
  const videoRef = useRef(null);
  const { data: user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleVideoSelect = (id) => {
    setCurrentVideoId(id);
    navigate(`/video/${id}`);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setPageLoading(true);
      setError(null);
      setVideo(null);
      try {
        const res = await VideoApi.getVideoById(videoId);
        setcommentVideoId(res.data.data._id);
        setVideo(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("You must be logged in to view this video.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

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
  if (!video) return null;

  const uploadTime = getTimeAgo(video.createdAt);

  const charLimit = 100;

  const isLong = video.description.length > charLimit;
  const displayText =
    showFull || !isLong
      ? video.description
      : video.description.slice(0, charLimit) + "...";

  if (pageLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading video data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        {error}
      </div>
    );

  if (!video) return null;

  return (
    <div className="flex justify-center  p-6">
      <div className="w-[60%]">
        <div className="bg-black p-5 border-2 border-gray-800 rounded-2xl mb-4">
          <div className="relative w-full max-w-4xl mx-auto group">
            {/* ✅ Loader during buffering */}
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10 rounded-lg">
                <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <video
              ref={videoRef}
              src={video.videoFile.url}
              className="w-full rounded-lg h-[450px] bg-black cursor-pointer"
              controls
              autoPlay
              onLoadStart={() => setVideoLoading(true)}
              onCanPlay={() => setVideoLoading(false)}
              onWaiting={() => setVideoLoading(true)}
              onPlaying={() => setVideoLoading(false)}
            />

            <style>{`
              video::-webkit-media-controls {
                opacity: 0;
                transition: opacity 0.3s;
              }
              .group:hover video::-webkit-media-controls {
                opacity: 1;
              }
            `}</style>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold mb-3">{video.title}</h1>

        <div className="flex items-center justify-between mb-4">
       <div className="flex items-center gap-3 cursor-pointer">
  <div
    className="flex justify-center"
    onClick={() => navigate(`/c/${video.owner.username}`)}
  >
    <img
      src={video.owner?.avatar?.url || "/default-avatar.png"}
      alt={video.owner?.fullname || "User"}
      className="w-12 h-12 rounded-full object-cover"
    />
  </div>

  <div
    className="flex flex-col"
    onClick={() => navigate(`/c/${video.owner.username}`)}
  >
    <h2 className="text-white font-semibold">
      {video.owner?.fullname || "Unknown"}
    </h2>
    <p className="text-gray-400 text-sm">
      {video.owner?.subscriberscount || 0} subscribers
    </p>
  </div>

  <Subscriber video={video} />
</div>


          <div className="flex items-end justify-around space-x-3">
            <div className="flex items-center bg-[#222222] px-2 rounded-4xl overflow-hidden">
              <Likes video={video} />
            </div>

            <button
              onClick={() => window.open(video.videoFile.url, "_blank")}
              className="flex items-center justify-center bg-[#222222] rounded-4xl text-white px-4 py-2"
            >
              ⬇️ Download
            </button>

            <Playlist video={video} />
          </div>
        </div>
        <div className="w-full bg-[#222222] rounded-3xl p-4 hover:bg-[#6e2424] pt-2 text-white">
          <div className="flex gap-4 text-sm text-gray-400 mb-2">
            <span>{video.views} views</span>
            <span>{uploadTime}</span>
          </div>
          <h1 className="text-base  whitespace-pre-line">{displayText}</h1>
          {isLong && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="mt-2 text-white  cursor-pointer hover:underline text-sm"
            >
              {showFull ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <Comments video={video} commentVideoId={commentVideoId} />
      </div>

      <div className="w-[30%] flex flex-col gap-4">
        <VideoDetails
          currentVideoId={currentVideoId}
          currentUserId={user?._id}
          onVideoSelect={handleVideoSelect}
        />
      </div>
    </div>
  );
}

export default Mainvideo_page;
