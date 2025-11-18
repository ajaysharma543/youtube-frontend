import React, { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import likeApi from "../../../api/like";
import dislikeapi from "../../../api/dislike";

function Likecomment({ commentId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    if (!commentId) return;

    const fetchStatus = async () => {
      try {
        const likeRes = await likeApi.getCommentLikeStatus(commentId);
        const dislikeRes = await dislikeapi.getCommentDislikeStatus(commentId);

        setIsLiked(likeRes.data.data.isLiked);
        setLikeCount(likeRes.data.data.likeCount);

        setIsDisliked(dislikeRes.data.data.isDisliked);
        setDislikeCount(dislikeRes.data.data.dislikeCount);
      } catch (error) {
        console.error("Error fetching comment reactions:", error);
      }
    };

    fetchStatus();
  }, [commentId]);

  const handleToggleLike = async () => {
    try {
      const res = await likeApi.togglecommentLike(commentId);
      const { isLiked, likeCount, dislikeCount } = res.data.data;

      setIsLiked(isLiked);
      setLikeCount(likeCount);
      setIsDisliked(!isLiked && dislikeCount > 0 ? false : isDisliked);
      setDislikeCount(dislikeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleToggleDislike = async () => {
    try {
      const res = await dislikeapi.toggleCommentDislike(commentId);
      const { isDisliked, dislikeCount, likeCount } = res.data.data;

      setIsDisliked(isDisliked);
      setDislikeCount(dislikeCount);
      setIsLiked(!isDisliked && likeCount > 0 ? false : isLiked);
      setLikeCount(likeCount);
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handleToggleLike}
        className={`flex items-center gap-1 text-sm ${
          isLiked ? "text-yellow-400" : "text-gray-400"
        }`}
      >
        <ThumbsUp size={18} className={isLiked ? "fill-yellow-400" : ""} />
        <span>{likeCount}</span>
      </button>

      <button
        onClick={handleToggleDislike}
        className={`flex items-center gap-1 text-sm ${
          isDisliked ? "text-blue-400" : "text-gray-400"
        }`}
      >
        <ThumbsDown size={18} className={isDisliked ? "fill-blue-400" : ""} />
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
}

export default Likecomment;
