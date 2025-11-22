import React, { useEffect, useState } from "react";
import VideoApi from "../../../api/videoapi";
import Playlist from "../../playvideo_dahboard/playlist/playlist";
import { useNavigate } from "react-router-dom";

function Allsubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await VideoApi.getchanneldetails();
        setSubscriptions(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };
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

  //   const truncateText = (text, maxLength) => {
  //     if (!text) return '';
  //     return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  //   };

  const truncateWords = (text, maxWords) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="p-4 ">
      <div className="w-[90%] flex justify-end">
        <button
          className="font-bold cursor-pointer p-2 rounded-2xl text-blue-400 hover:bg-gray-600"
          onClick={() => navigate("/Subscription")}
        >
          manage
        </button>
      </div>
      <div className="w-full">
        {subscriptions.map((video) => (
          <div className="border-b border-gray-500">
            <div
              key={video._id}
              className="relative cursor-pointer pb-16 w-[80%]  overflow-hidden shadow-md hover:shadow-lg transition-shadow"
             
            >
              <div className="flex items-center gap-3 p-3" onClick={() => navigate(`/c/${video.owner.username}`)}>
                <img
                  src={video.owner.avatar?.url || "/default-avatar.png"}
                  alt={video.owner.fullname}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white font-semibold">
                  {video.owner.fullname}
                </span>
              </div>

              <div className="flex gap-4"  onClick={() => navigate(`/video/${video._id}`)}>
                <div className=" w-63 relative">
                  <img
                    src={video.thumbnail.url || "/default-thumbnail.jpg"}
                    alt={video.title}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 bg-black opacity-70 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-white mb-2 font-semibold text-2xl">
                    {video.title}
                  </h3>
                  <div className="flex w-[50%] justify-start  mb-3 text-gray-300 text-sm">
                    <span>{video.owner.fullname}</span>
                    <span className="pl-2">{video.views} views</span>
                    <span className="pl-2">{getTimeAgo(video.createdAt)} </span>
                  </div>
                  <p className="text-gray-400 text-sm w-full">
                    {truncateWords(video.description, 30)}
                  </p>
                </div>
              </div>
              <div className="absolute top-7 right-0 z-50">
                <Playlist video={video} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Allsubscriptions;
