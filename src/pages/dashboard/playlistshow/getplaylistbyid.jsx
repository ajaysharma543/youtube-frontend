import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react"; // 3-dot icon
import playlistApi from "../../../api/playlist";

function PlaylistVideos() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        console.log("Fetching playlist for ID:", playlistId);
        const res = await playlistApi.getPlaylistById(playlistId);
        console.log("Full API Response:", res);

        const playlistData = res.data?.data?.[0];
        setPlaylist(playlistData || null);
      } catch (error) {
        console.error(
          "Error loading playlist:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveFromPlaylist = async (videoId) => {
    try {
      await playlistApi.removeVideoFromPlaylist({ playlistId, videoId });

      setPlaylist((prev) => {
        if (!prev) return prev; // if null, just skip
        return {
          ...prev,
          videos: prev.videos.filter((v) => v._id !== videoId),
        };
      });

      setMenuOpen(null);
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };
  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!playlist) return <p className="text-white">Playlist not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">{playlist.name}</h1>
      <p className="text-gray-400 mb-6">{playlist.description}</p>

      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlist.videos.map((video) => (
            <div
              key={video._id}
              onClick={() => handleVideoClick(video._id)}
              className="relative bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full h-48 bg-black">
                <img
                  src={video.thumbnail?.url || "/default-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white truncate">
                  {video.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {video.description}
                </p>
              </div>

              <div className="absolute bottom-0 right-0 ">
                <button
                  className="p-2 rounded-full cursor-pointer  text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === video._id ? null : video._id);
                  }}
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpen === video._id && (
                  <div className="absolute bottom-10 right-0 bg-[#2b2b2b] text-white rounded-lg shadow-lg w-40 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromPlaylist(video._id);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#3b3b3b] rounded-lg"
                    >
                      Remove from Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No videos in this playlist.</p>
      )}
    </div>
  );
}

export default PlaylistVideos;
