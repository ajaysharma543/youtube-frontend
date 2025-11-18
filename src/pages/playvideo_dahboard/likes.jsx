import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dislikes from "./dislike";
import { fetchLikeStatus, togglelikes } from "../../redux/features/likes";
import { ThumbsUp } from "lucide-react"; // 👈 Import Lucide icon
import { fetchDislikeStatus } from "../../redux/features/disliked";

function Likes({ video }) {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const loading = useSelector((state) => state.like.loading);
  const likesState = useSelector((state) => state.like.byVideoId[video._id]);

  const isLiked = likesState?.isLiked || false;
  const likeCount = likesState?.likeCount || 0;

  useEffect(() => {
    if (video?._id) {
      dispatch(fetchLikeStatus(video._id));
    }
  }, [video?._id, dispatch]);

  const handleLikeToggle = async () => {
    if (!user) return alert("Please login to like videos");
    if (loading) return;

    await dispatch(togglelikes(video._id));
    dispatch(fetchDislikeStatus(video._id));
  };

  return (
    <div className="flex items-center rounded-4xl overflow-hidden pl-1 pr-1">
      <button
        onClick={handleLikeToggle}
        disabled={loading}
        className={`flex cursor-pointer items-center justify-center text-white pl-2 py-2 transition-colors duration-200 ${
          isLiked ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
        }`}
      >
        <ThumbsUp
          size={22}
          className={isLiked ? "fill-yellow-400 text-yellow-400" : ""}
        />
        <span className="ml-2">{likeCount}</span>
      </button>

      <span className="w-px bg-[#aaa] h-6 ml-2" />
      <Dislikes video={video} />
    </div>
  );
}

export default Likes;
