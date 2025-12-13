import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoApi from "../../api/videoapi";
import VideoCard from "./dashboard_components/video_show";
import authApi from "../../api/userapi";
import Playlist from "../playvideo_dahboard/playlist/playlist";
import {
  resetSubscriptionState,
  setSubscriptionState,
  toggleSubscriptionFailure,
} from "../../redux/features/subscription";
import subscriberApi from "../../api/subscribers";

function Dashboard() {
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelUser, setChannelUser] = useState(null);
  const dispatch = useDispatch();
  const [channelVideos, setChannelVideos] = useState([]);
  const { query } = useSelector((state) => state.videos);
  const { data: user, loading: userLoading } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (!query) {
      setChannelUser(null);
      setChannelVideos([]);
      return;
    }

    const fetchChannel = async () => {
      try {
        const res = await authApi.getUserChannelProfile(query);
        setChannelUser(res.data.data);
        // console.log("channeluser", res.data.data);
        const vids = await VideoApi.getallvideos({
          userId: res.data.data._id,
          page: 1,
          limit: 50,
        });

        setChannelVideos(vids.data.data.docs);
        // console.log(vids.data.data.docs);
      } catch (err) {
        setChannelUser(null);
        setChannelVideos([]);
      }
    };
    fetchChannel();
  }, [query]);

  useEffect(() => {
    if (userLoading) return;

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await VideoApi.getallvideos({ page: 1, limit: 10 });
        const allVideos = res.data.data.docs;

        const filteredVideos =
          user && user._id
            ? allVideos.filter((vid) => vid.owner._id !== user._id)
            : allVideos;

        setVideo(filteredVideos);
        // console.log(filteredVideos);
      } catch (error) {
        // console.log("video not showing", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userLoading, user?._id, user]);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">Loading videos...</div>
    );
  }

  const displayedVideos = video.filter((v) => {
    const queryLower = query?.toLowerCase() || "";
    return (
      v.title?.toLowerCase().includes(queryLower) ||
      v.description?.toLowerCase().includes(queryLower) ||
      v.owner._id?.toLowerCase().includes(queryLower) ||
      v.owner.username?.toLowerCase().includes(queryLower) ||
      v.owner.fullname?.toLowerCase().includes(queryLower)
    );
  });
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
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
  if (!video) return null;

  const handleSubscriber = async (channelId) => {
    dispatch(resetSubscriptionState());

    try {
      const res = await subscriberApi.subscribe(channelId);
      const subscribed = res.data?.data?.subscribe;
      // console.log("Subscription response:", subscribed);

      setChannelUser((prev) => ({
        ...prev,
        issubscribed: subscribed,
      }));

      dispatch(setSubscriptionState(subscribed));
    } catch (error) {
      // console.log("Subscription failed:", error);
      dispatch(toggleSubscriptionFailure());
    }
  };

  return (
    <div className="p-0 xs:p-4  min-h-screen bg-gray-200 text-white">
      {channelUser && (
        <div className="mb-8">
          <div
            className="
    rounded-xl p-6 
    flex items-center justify-between
    max-[639px]:flex-row max-[639px]:gap-4 max-[639px]:items-start
  "
          >
            <div className="w-2/5 max-[639px]:w-[25%]">
              <img
                src={channelUser.avatar?.url}
                className="
        w-28 h-28 rounded-full object-cover
        max-[639px]:w-14 max-[639px]:h-14
      "
              />
            </div>

            <div
              className="
      w-2/5 flex flex-col
      max-[639px]:w-[full]
      max-[639px]:text-sm max-[639px]:leading-tight
    "
            >
              <h2 className="text-2xl font-bold max-[639px]:text-base">
                {channelUser.fullname}
              </h2>

              <div className="flex text-gray-400 max-[639px]:flex-col max-[639px]:gap-0">
                <p className="pr-2 max-[639px]:pr-0">@{channelUser.username}</p>
                <p className="pr-2 max-[639px]:pr-0">
                  {channelUser.totalsubscriber} subscribers
                </p>
              </div>
            </div>

            <div
              className="
      w-1/5 flex justify-end
      max-[639px]:w-[20%] max-[639px]:justify-center
    "
              onClick={() => handleSubscriber(channelUser._id)}
            >
              <span
                className={`
        px-8 py-2 rounded-3xl cursor-pointer text-lg font-semibold
        ${
          channelUser.issubscribed
            ? "bg-gray-600 text-white"
            : "bg-white text-black"
        }
        max-[639px]:px-3 max-[639px]:py-1 max-[639px]:text-xs
      `}
              >
                {channelUser.issubscribed ? "Subscribed" : "Subscribe"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            {channelVideos.length === 0 ? (
              <p className="text-gray-400">
                This user has not uploaded any videos yet.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {channelVideos.map((item) => (
                  <div
                    key={item._id}
                    className="
        flex relative w-full gap-4 p-4 rounded-xl 
        max-[639px]:flex-col
      "
                  >
                    {/* Thumbnail */}
                    <div className="w-[40%] relative max-[639px]:w-full">
                      <img
                        src={item.thumbnail?.url}
                        className="w-full h-55 object-cover rounded-lg"
                      />
                      <span className="absolute bottom-2 right-2 bg-white bg-opacity-80 text-xs px-2 py-0.5 rounded">
                        {formatDuration(item.duration)}
                      </span>
                    </div>

                    {/* Right Section */}
                    <div className="w-[60%] flex flex-col gap-1 max-[639px]:w-full">
                      {/* Title */}
                      <h2 className="text-lg font-semibold line-clamp-2 pb-2 leading-tight max-[639px]:text-sm">
                        {item.title}
                      </h2>

                      {/* FLEX ROW showing Views + Time + Avatar + Fullname on mobile */}
                      <div
                        className="
            flex items-center gap-3 text-sm text-gray-300 
            max-[639px]:flex max-[639px]:items-center max-[639px]:justify-start
          "
                      >
                        {/* LEFT SIDE: Views + Time */}
                        <div className="flex items-center gap-3 max-[639px]:text-xs">
                          <h3>{item.views} views</h3>
                          <h3>{getTimeAgo(item.createdAt)}</h3>
                        </div>

                        {/* RIGHT SIDE: Avatar + Fullname */}
                        <div className="flex items-center gap-2 max-[639px]:text-xs">
                          <img
                            src={channelUser.avatar?.url}
                            className="w-6 h-6 rounded-full object-cover max-[639px]:w-4 max-[639px]:h-4"
                          />
                          <h3 className="font-semibold text-sm max-[639px]:text-xs">
                            {channelUser.fullname}
                          </h3>
                        </div>
                      </div>

                      {/* Description (hidden on mobile) */}
                      <p className="text-gray-400 text-sm line-clamp-2 pt-3 max-[639px]:hidden">
                        {item.description}
                      </p>
                    </div>

                    {/* Playlist Button */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
          absolute top-2 right-2 z-50 
          max-[639px]:top-auto max-[639px]:right-2 max-[639px]:bottom-2
        "
                    >
                      <Playlist video={item} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!channelUser && (
        <>
          {displayedVideos.length === 0 ? (
            <p>No Video Found</p>
          ) : (
            <div className="grid bg-gray-200 max-[570px]:grid-cols-1 pb-20 sm:grid-cols-2 max-[960px]:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVideos.map((item) => (
                <VideoCard key={item._id} video={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
