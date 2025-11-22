import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../../../api/userapi";
import {
  resetSubscriptionState,
  setSubscriptionState,
  toggleSubscriptionFailure,
} from "../../../redux/features/subscription";
import subscriberApi from "../../../api/subscribers";
import { useNavigate } from "react-router-dom";

function Subscriptondash() {
  const { data: user } = useSelector((state) => state.user);
  const [subs, setSubs] = useState([]);
  // const [expanded, setExpanded] = useState({});
const navigate = useNavigate()
  const dispatch = useDispatch();
  useEffect(() => {
    const getsubs = async () => {
      if (!user?.username) return;

      const res = await authApi.getUserChannelProfile(user.username);

      console.log("Subscribed Channels:", res.data.data.mysubscribedchannels);

      setSubs(res.data.data.mysubscribedchannels || []);
      // console.log(res.data.data.mysubscribedchannels || []);
    };

    getsubs();
  }, [user]);

  const handleSubscriber = async (channelId) => {
    dispatch(resetSubscriptionState());

    try {
      const res = await subscriberApi.subscribe(channelId);
      const subscribed = res.data?.data?.subscribe;
      console.log("Subscription response:", subscribed);

      setSubs((prev) =>
        prev.map((ch) =>
          ch._id === channelId ? { ...ch, issubscribed: subscribed } : ch
        )
      );

      dispatch(setSubscriptionState(subscribed));
    } catch (error) {
      console.log("Subscription failed:", error);
      dispatch(toggleSubscriptionFailure());
    }
  };

  return (
 <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">All Subscriptions</h1>

  <div className="flex justify-center items-center flex-col w-full">
    {/* If no subscriptions */}
    {subs.length === 0 ? (
      <p className="text-gray-400 text-lg mt-10">No subscriptions found.</p>
    ) : (
      subs.map((ch) => (
        <div
          key={ch._id}
          className="flex w-[80%] items-start cursor-pointer gap-4 bg-black p-4 rounded-xl shadow"
        >
          <div
            className="flex gap-4"
            onClick={() => navigate(`/c/${ch.username}`)}
          >
            <img
              src={ch.avatar?.url || "/default-avatar.png"}
              alt="avatar"
              className="w-30 h-30 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex flex-col w-[50%] min-w-[250px]">
              <h2 className="text-lg font-semibold">{ch.fullname}</h2>

              <div className="flex items-center gap-1 text-sm text-gray-400">
                <p>@{ch.username} :</p>
                <p>{ch.totalsubscriber || 0}</p>
                <span>Subscribers</span>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden text-ellipsis">
                {ch.description}
              </p>
            </div>
          </div>

          <div className="flex-1"></div>

          <div onClick={() => handleSubscriber(ch._id)}>
            <span
              className={`px-8 py-2 rounded-3xl cursor-pointer text-lg font-semibold ${
                ch.issubscribed
                  ? "bg-gray-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {ch.issubscribed ? "Subscribed" : "Subscribe"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
}

export default Subscriptondash;
