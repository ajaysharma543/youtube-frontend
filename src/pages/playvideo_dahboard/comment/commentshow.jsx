import React, { useState } from "react";
import commentApi from "../../../api/comments";
import { useForm } from "react-hook-form";
import Deletecomment from "./deletecomment";
import { ThumbsUp } from "lucide-react";
import Likecomment from "./likecomment";

const CommentList = ({
  comments,
  loading,
  hasLoaded,
  openMenuId,
  setOpenMenuId,
  setComments,
  getTimeAgo,
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const handleEditClick = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    reset({ comment: currentContent });
  };

  const handleEditSubmit = async (data, commentId) => {
    try {
      const formData = new FormData();
      formData.append("content", data.comment);

      const res = await commentApi.editcomment(commentId, formData);
      console.log("comment ", res.data.data);
      const updatedComment = res.data.data;
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: updatedComment.content }
            : comment
        )
      );
      setEditingCommentId(null);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="loader border-4 border-gray-600 border-t-white rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  if (!hasLoaded) return null;

  return (
    <div className="mt-4 space-y-3">
      {comments.map((comment) => {
        const uploadTime = getTimeAgo(comment.createdAt);
        const isMenuOpen = openMenuId === comment._id;
        const isEditing = editingCommentId === comment._id;

        return (
          <div
            key={comment._id}
            className="p-3 rounded-xl text-white flex items-start gap-2 relative"
          >
            <img
              src={comment.owner?.avatar?.url || "/default-avatar.png"}
              alt={comment.owner?.username}
              className="w-9 h-9 object-cover rounded-full mt-1"
            />

            <div className="flex-1 ml-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <h1 className="font-semibold text-sm">
                    {comment.owner?.username}
                  </h1>
                  <p className="text-xs pl-2 text-gray-400">{uploadTime}</p>
                </div>

                {!isEditing && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : comment._id)
                      }
                      className="text-gray-400 cursor-pointer hover:text-white px-2"
                    >
                      ⋮
                    </button>

                    {isMenuOpen && (
                      <div className="absolute cursor-pointer right-0 top-5 bg-[#333] rounded-lg shadow-md w-28 text-sm z-10">
                        <button
                          onClick={() =>
                            handleEditClick(comment._id, comment.content)
                          }
                          className="block w-full text-left px-3 py-2 hover:bg-[#444] rounded-t-lg"
                        >
                          ✏️ Edit
                        </button>
                        <Deletecomment
                          comment={comment}
                          setComments={setComments}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <form
                  onSubmit={handleSubmit((data) =>
                    handleEditSubmit(data, comment._id)
                  )}
                  className="mt-2"
                >
                  <textarea
                    {...register("comment", { required: true })}
                    className="w-full bg-transparent border-b border-gray-400 focus:border-gray-200 focus:outline-none resize-none p-2 text-white"
                    rows={1}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 text-gray-400 hover:bg-[#222] rounded-2xl hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#222] text-white rounded-2xl"
                      onClick={() => !isEditing}
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-2 text-sm whitespace-pre-line">
                  {comment.content}
                </p>
              )}
              <Likecomment commentId={comment._id} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
