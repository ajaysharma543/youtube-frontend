import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchUserVideos,
  fetchVideosStart,
  fetchVideosFailure,
} from "../../../redux/features/fetchvideoslice";
import VideoApi from "../../../api/videoapi";

function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.videos);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
    },
  });

  // Fetch videos if not loaded
  useEffect(() => {
    if (!videos || videos.length === 0) {
      dispatch(fetchUserVideos());
    }
  }, [dispatch, videos]);

  // Set current video in form
  useEffect(() => {
    if (videos && videos.length > 0 && videoId) {
      const found = videos.find((v) => String(v._id) === String(videoId));
      if (found) {
        setVideo(found);
        setValue("title", found.title);
        setValue("description", found.description || "");
        setPreview(found.thumbnail?.url || null);
      }
    }
  }, [videos, videoId, setValue]);

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("thumbnail", file); // store as File directly
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      setSaving(true);
      dispatch(fetchVideosStart());

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      }
      await VideoApi.updateVideo(videoId, formData);
      await dispatch(fetchUserVideos());
      navigate("/content");
    } catch (err) {
      console.error("❌ Update failed:", err);
      dispatch(fetchVideosFailure("Failed to update video"));
    } finally {
      setSaving(false);
    }
  };

  // ✅ Loading state
  if (loading && !video) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        ⏳ Loading video details...
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        ❌ {typeof error === "string" ? error : "Something went wrong"}
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        ⚠️ Video not found
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      {/* Left side — edit form */}
      <div className="w-1/2 p-8 flex flex-col gap-6 border-r border-gray-800">
        <h2 className="text-3xl font-bold mb-2">Edit Video</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Thumbnail */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Thumbnail
            </label>
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-700"
                />
              ) : (
                <div className="w-full h-64 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 border border-gray-700">
                  No thumbnail selected
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                onChange={handleThumbnailChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload new thumbnail"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
              className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Change Thumbnail
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="5"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`${
              saving
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } px-6 py-2 rounded-lg font-semibold self-start`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Right side — video preview */}
      <div className="w-1/2 p-8 flex justify-center items-center">
        <video
          src={video.videoFile?.url}
          controls
          className="rounded-lg w-full h-[70%] object-cover border border-gray-700"
        />
      </div>
    </div>
  );
}

export default EditVideo;
