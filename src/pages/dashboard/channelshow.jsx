// ChannelPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authApi from "../../api/userapi";
import subscriberApi from "../../api/subscribers";
import Profiledatashow from "./profiledatashow";

function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await authApi.getUserChannelProfile(`${username}`);
        setChannel(res.data?.data || null);
      } catch (err) {
        setError("Failed to load channel", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username]);

  const handleSubscriber = async (channelId) => {
    try {
      const res = await subscriberApi.subscribe(channelId);
      console.log(res.data.data);

      setChannel((prev) => ({
        ...prev,
        issubscribed: !prev.issubscribed,
      }));
    } catch (err) {
      console.log("Subscription error:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!channel) return <p className="p-6 text-gray-400">No channel found</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {channel.coverImage?.url && (
        <div className="w-full h-56 max-[640px]:hidden overflow-hidden rounded-xl shadow-lg">
          <img
            src={channel.coverImage.url}
            className="w-full h-full object-cover"
            alt="cover"
          />
        </div>
      )}

      <div className="flex gap-6 items-center mt-4">
        {/* Avatar */}
        <img
          src={channel.avatar?.url || "/default-profile.png"}
          className="w-40 h-40 rounded-full object-cover border-2 border-gray-700 shadow-md"
          alt={channel.fullname}
        />

        {/* Channel Info */}
        <div className="flex flex-col justify-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            {channel.fullname}
          </h1>

          <div className="flex items-center gap-3 text-gray-300">
            <p className="text-md">@{channel.username}</p>
            <span className="text-md">
              • {channel.totalsubscriber} subscribers
            </span>
          </div>

          <div className="text-sm text-gray-400 line-clamp-2 max-w-md">
            {channel.description}
          </div>

          {/* Subscribe Button */}
          <div className="mt-3" onClick={() => handleSubscriber(channel._id)}>
            <span
              className={`px-7 py-2 rounded-lg cursor-pointer text-lg font-semibold shadow-md transition-all ${
                channel.issubscribed
                  ? "bg-[#232121] text-white"
                  : "bg-white text-black"
              }`}
            >
              {channel.issubscribed ? "Subscribed" : "Subscribe"}
            </span>
          </div>
        </div>
      </div>

      <Profiledatashow userId={channel._id} />
    </div>
  );
}

export default ChannelPage;
