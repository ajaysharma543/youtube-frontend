import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import commentApi from "../../../api/comments";
import CommentList from "./commentshow";

function Comments({ commentVideoId }) {
  const { data: user } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const commentsRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!commentVideoId || hasLoaded) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          observer.disconnect();
          setHasLoaded(true);
          setLoading(true);

          setTimeout(async () => {
            try {
              const res = await commentApi.getvideocomments(commentVideoId);
              const allComments = res.data.data.docs || [];
              setComments(allComments);
            } catch (err) {
              console.error("Error fetching comments:", err);
            } finally {
              setLoading(false);
            }
          }, 1300);
        }
      },
      { threshold: 0.2 }
    );

    if (commentsRef.current) observer.observe(commentsRef.current);
    return () => observer.disconnect();
  }, [commentVideoId, hasLoaded]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("content", data.comment);

      const res = await commentApi.addcomment(commentVideoId, formData);

      const newComment = {
        ...res.data.data,
        owner: {
          username: user?.fullname || user?.name || "You",
          avatar: { url: user?.avatar?.url || "/default-avatar.png" },
        },
      };

      setComments((prev) => [newComment, ...prev]);
      reset();
      setShowButtons(false);
    } catch (err) {
      console.error("Error adding comment:", err);
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
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  return (
    <div className="mt-4" ref={commentsRef}>
      <h1 className="pl-5 mb-4"> {comments.length} comments </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-start gap-3 w-full"
      >
        <img
          src={user?.avatar?.url || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 object-cover rounded-full mt-3"
        />

        <div className="flex-1 flex flex-col">
          <textarea
            {...register("comment", { required: true })}
            placeholder="Write a comment..."
            className="w-full bg-transparent border-b border-gray-400 focus:border-gray-200 focus:outline-none resize-none p-2 text-white placeholder-gray-400"
            rows={1}
            onFocus={() => setShowButtons(true)}
          />

          {showButtons && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="px-3 py-1 text-gray-400 hover:bg-[#222222] rounded-2xl hover:text-white"
                onClick={() => {
                  reset();
                  setShowButtons(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-2 bg-[#222222] text-white rounded-2xl"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>
      <CommentList
        comments={comments}
        loading={loading}
        hasLoaded={hasLoaded}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        getTimeAgo={getTimeAgo}
        setShowButtons={setShowButtons}
        setComments={setComments}
      />
    </div>
  );
}

export default Comments;
