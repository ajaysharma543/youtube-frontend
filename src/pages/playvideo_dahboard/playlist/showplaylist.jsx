import { Save } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVideoToPlaylist } from "../../../redux/features/playlist";

function Showplaylist({ video }) {
  const { list = [], loading } = useSelector((state) => state.playlist || {});
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const res = await dispatch(addVideoToPlaylist(playlistId, video._id));
      console.log(res);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add video:", error);
    }
  };

  if (loading) return <p className="text-gray-400 px-4 py-2">Loading...</p>;

  if (!list || list.length === 0)
    return (
      <p className="text-gray-400 text-sm px-4 py-2">
        No playlists found. Create one below.
      </p>
    );

  return (
    <>
      {showSuccess && (
        <div className="fixed bottom-5 left-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn z-[9999]">
          ✅ Video added successfully
        </div>
      )}
      <div className="max-h-60 overflow-y-auto">
        {list.map((playlist) => (
          <button
            key={playlist._id}
            onClick={() => handleAddToPlaylist(playlist._id)}
            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-[#333333] transition-colors"
          >
            <Save className="text-green-400" size={18} />
            <span>🎵 {playlist.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default Showplaylist;
