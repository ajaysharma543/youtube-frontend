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
      // console.log(res.data.data);

      setChannel((prev) => ({
        ...prev,
        issubscribed: !prev.issubscribed,
      }));
    } catch (err) {
      // console.log("Subscription error:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!channel) return <p className="p-6 text-gray-400">No channel found</p>;

  return (
<div className="max-w-6xl mx-auto bg-gray-200 rounded-xl overflow-hidden">

  {/* Cover */}
  <div className="relative w-full h-64">
   {channel.coverImage?.url ? (
  <img
    src={channel.coverImage.url}
    className="w-full h-full object-cover"
    alt="cover"
  />
) : (
  <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
    <span className="text-white text-xl font-semibold">
      {channel.fullname}
    </span>
  </div>

    )}

    {/* Name on cover */}
    <div className="absolute bottom-4 left-52 text-white">
      <h1 className="text-3xl font-bold drop-shadow-lg">
        {channel.fullname}
      </h1>
    </div>

    {/* Avatar - perfectly half outside */}
    <img
      src={channel.avatar?.url || "/default-profile.png"}
      alt={channel.fullname}
      className="
        absolute
        left-6
        -bottom-20
        w-35 h-35
        rounded-full
        object-cover
        border-4 border-white
        shadow-xl
        bg-white
      "
    />
  </div>

  {/* Info Section */}
  <div className="  w-full pb-6 flex justify-between items-start">

    <div className="space-y-2 px-50">
      <div className="flex items-center gap-3 text-black">
        <p className="text-sm opacity-90">@{channel.username}</p>
        <span className="text-md">
          • {channel.totalsubscriber} subscribers
        </span>
      </div>

      <p className="text-sm text-black line-clamp-2 max-w-md">
        {channel.description}
      </p>
    </div>

    {/* Subscribe Button */}
    <div onClick={() => handleSubscriber(channel._id)} className="-mt-4 z-10">
      <span
        className={`px-7 py-2 rounded-full  cursor-pointer text-lg font-semibold transition-all
          ${
            channel.issubscribed
              ? "bg-gray-300 text-black"
              : "bg-black text-white"
          }
        `}
      >
        {channel.issubscribed ? "Subscribed" : "Subscribe"}
      </span>
    </div>

  </div>

  <Profiledatashow userId={channel._id} />
</div>
  )
}


export default ChannelPage;
