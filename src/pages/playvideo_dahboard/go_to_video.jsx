import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import VideoApi from "../../api/videoapi";
import VideoCard from "./videoshow";
import Playlist from "./playlist/playlist";

const VideoDetails = ({ currentVideoId, currentUserId, onVideoSelect }) => {
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(false);
  // const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await VideoApi.getallvideos({ page: 1, limit: 10 });
        let allVideos = res.data.data.docs;

        const filtered = allVideos.filter(
          (v) => v._id !== currentVideoId && v.owner._id !== currentUserId
        );

        setVideo(filtered);
      } catch (error) {
        console.log("video not showing", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [currentVideoId]);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">Loading videos...</div>
    );
  }

  return (
    <>
      <div className="p-6 min-h-screen bg-black text-white">
        {Array.isArray(video) && video.length === 0 ? (
          <p>No Video Found</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
            {video.map((item) => (
              <VideoCard
                key={item._id}
                video={item}
                onSelect={() => onVideoSelect(item._id)} // call function passed from parent
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoDetails;
