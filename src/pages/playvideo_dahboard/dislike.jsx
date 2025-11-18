import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDislikeStatus,
  toggleDislikes,
} from "../../redux/features/disliked";
import { ThumbsDown } from "lucide-react"; // 👈 Import Lucide icon
import { fetchLikeStatus } from "../../redux/features/likes";

function Dislikes({ video }) {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const dislikesState = useSelector(
    (state) => state.dislike.byVideoId[video._id]
  );
  const loading = useSelector((state) => state.dislike.loading);

  const isDisliked = dislikesState?.isDisliked || false;
  const dislikeCount = dislikesState?.dislikeCount || 0;

  useEffect(() => {
    if (video?._id) {
      dispatch(fetchDislikeStatus(video._id));
    }
  }, [video?._id, dispatch]);

  const handleDislikeToggle = async () => {
    if (!user) return alert("Please login to dislike videos");
    if (loading) return;

    await dispatch(toggleDislikes(video._id));
    dispatch(fetchLikeStatus(video._id)); // runtime sync (optional)
  };

  return (
    <button
      onClick={handleDislikeToggle}
      disabled={loading}
      className={`flex cursor-pointer items-center justify-center text-white pl-2 py-2 transition-colors duration-200 ${
        isDisliked ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
      }`}
    >
      <ThumbsDown
        size={22}
        className={isDisliked ? "fill-blue-400 text-blue-400" : ""}
      />
      <span className="ml-2">{dislikeCount}</span>
    </button>
  );
}

export default Dislikes;
