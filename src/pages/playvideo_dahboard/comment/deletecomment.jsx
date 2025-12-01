import React from "react";
import commentApi from "../../../api/comments";

function Deletecomment({ comment, setComments }) {
  const handleDelete = async () => {
    try {
      const res = await commentApi.deletecomment(comment._id);
      // console.log("Deleted:", res.data);

      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch (error) {
      // console.error("Error deleting comment:", error);
    }
  };

  return (
    <button
      className="block w-full text-left px-3 py-2 hover:bg-[#444] rounded-b-lg text-red-400"
      onClick={handleDelete}
    >
      🗑️ Delete
    </button>
  );
}

export default Deletecomment;
