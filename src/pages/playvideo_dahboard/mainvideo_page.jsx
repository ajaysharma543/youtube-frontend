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
        // console.log(res.data.data);
      } catch (err) {
        // console.error("Error fetching video:", err);
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
    <div
      className="
      flex flex-col lg:flex-row justify-center gap-6 w-full 
bg-[linear-gradient(to_right,#1f1f1f,#000000)] p-0"
    >
      <div className="w-full lg:w-[60%] rounded-2xl bg-[linear-gradient(to_right,#1f1f1f,#000000)] ">
        <div className="rounded-2xl">
          <div className="relative w-full h-[500px] flex items-center group">
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10 rounded-lg">
                <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <video
              ref={videoRef}
              src={video.videoFile.url}
              className="w-full rounded-2xl h-[90%] bg-transparent  cursor-pointer"
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

        <h1 className="text-white text-2xl font-bold mb-3 bg-transparent bg-[linear-gradient(to_right,#1f1f1f,#000000)]">{video.title}</h1>
        <div className="flex items-center  max-sm:flex-col max-sm:items-start  justify-between mb-4 bg-[linear-gradient(to_right#1f1f1f,#000000)]
">
          <div className="flex items-center max-sm:pb-4 gap-3 cursor-pointer">
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

          <div className="flex items-center justify-around space-x-3">
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

        {/* DESCRIPTION */}
        <div className="w-full bg-[#222222] rounded-3xl p-4 pt-2 text-white cursor-pointer  hover:bg-gray-700 border-gray-950 border">
          <div className="flex gap-4 text-sm text-gray-400 mb-2">
            <span>{video.views} views</span>
            <span>{uploadTime}</span>
          </div>

          <h1 className="text-base whitespace-pre-line">{displayText}</h1>

          {isLong && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="mt-2 text-white hover:underline text-sm"
            >
              {showFull ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* SMALL SCREENS — VideoDetails first */}
        <div className="w-full flex flex-col gap-4 lg:hidden">
          <VideoDetails
            currentVideoId={currentVideoId}
            currentUserId={user?._id}
            onVideoSelect={handleVideoSelect}
          />
        </div>
        <Comments video={video} commentVideoId={commentVideoId} />
      </div>

      {/* LARGE SCREENS — VideoDetails on right */}
      <div className="w-full lg:w-[30%] flex-col   hidden lg:flex order-3">
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
