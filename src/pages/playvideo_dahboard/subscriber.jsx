import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetSubscriptionState,
  setSubscriptionState,
  toggleSubscriptionFailure,
  toggleSubscriptions,
} from "../../redux/features/subscription";

function Subscriber({ video }) {
  const { data: user } = useSelector((state) => state.user);
  const { isSubscribed, loading, error } = useSelector(
    (state) => state.subscriber
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSubscriptionState(video?.owner?.issubscribed || false));
  }, [video]);

  const isOwner = user?._id === video?.owner?._id;

  const handleSubscriber = async () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }

    dispatch(resetSubscriptionState());

    try {
      const subscribed = await dispatch(toggleSubscriptions(video.owner._id));
      dispatch(setSubscriptionState(subscribed));
    } catch (error) {
      // console.log(error);

      dispatch(toggleSubscriptionFailure());
    }
  };

  if (error) return <p>Please try again</p>;

  return (
    <>
      {!isOwner && (
        <button
          onClick={handleSubscriber}
          disabled={loading}
          className={`px-4 py-2 rounded-4xl ml-4 cursor-pointer transition-all duration-300 ${
            isSubscribed ? "bg-[#222222] text-white" : "bg-white text-black"
          } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      )}
    </>
  );
}

export default Subscriber;
