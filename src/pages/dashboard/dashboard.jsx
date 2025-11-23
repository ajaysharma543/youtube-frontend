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
        console.log(filteredVideos);
      } catch (error) {
        console.log("video not showing", error.response?.data || error.message);
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
      console.log("Subscription response:", subscribed);

      setChannelUser((prev) => ({
        ...prev,
        issubscribed: subscribed,
      }));

      dispatch(setSubscriptionState(subscribed));
    } catch (error) {
      console.log("Subscription failed:", error);
      dispatch(toggleSubscriptionFailure());
    }
  };

  return (
    <div className="p-5 min-h-screen bg-black text-white">
      {channelUser && (
        <div className="mb-8">
          <div className="rounded-xl p-6 flex items-center justify-between">
            <div className="w-2/5 flex justify-center">
              <img
                src={channelUser.avatar?.url}
                className="w-28 h-28 rounded-full object-cover"
              />
            </div>

            <div className="w-2/5">
              <h2 className="text-2xl font-bold">{channelUser.fullname}</h2>
              <div className="flex">
                <p className="text-gray-400 pr-2">@{channelUser.username}</p>
                <p className="text-gray-400 pr-2">
                  {channelUser.totalsubscriber} subscribers
                </p>
              </div>
              <p className="text-gray-400 pr-2">{channelUser.description} </p>
            </div>

            <div
              className="w-1/5 flex justify-end"
              onClick={() => handleSubscriber(channelUser._id)}
            >
              <span
                className={`px-8 py-2 rounded-3xl cursor-pointer text-black text-lg font-semibold ${
                  channelUser.issubscribed
                    ? "bg-gray-600 text-white"
                    : "bg-white text-black"
                }`}
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
                    className="flex relative w-full gap-4 p-4 rounded-xl"
                  >
                    <div className="w-[40%] relative">
                      <img
                        src={item.thumbnail?.url}
                        className="w-full h-55 object-cover rounded-lg"
                      />
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-xs px-2 py-0.5 rounded">
                        {formatDuration(item.duration)}
                      </span>
                    </div>

                    <div className="w-[60%] flex flex-col gap-1">
                      <h2 className="text-lg font-semibold line-clamp-2 pb-2 leading-tight">
                        {item.title}
                      </h2>

                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <h3>{item.views} views</h3>
                        <h3>{getTimeAgo(item.createdAt)}</h3>
                      </div>

                      <div className="flex items-center gap-2 pt-3">
                        <img
                          src={channelUser.avatar?.url}
                          className="w-6 h-6 rounded-full object-cover"
                        />

                        <h3 className="font-semibold text-sm">
                          {channelUser.fullname}
                        </h3>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2 pt-3">
                        {item.description}
                      </p>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 z-50"
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
       <div className="grid max-[570px]:grid-cols-1 sm:grid-cols-2 max-[960px]:grid-cols-2 lg:grid-cols-3 gap-4">
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
