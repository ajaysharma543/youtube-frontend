import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus } from "lucide-react";
import {
  setDetails,
  setThumbnail,
  setLoading,
  setError,
  clearVideo,
} from "../../redux/features/videoslice";
import VideoApi from "../../api/videoapi";

function VideoDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videourl, name, loading, error, file } = useSelector(
    (state) => state.video
  );
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: name || "",
      description: "",
    },
  });

  useEffect(() => {
    setValue("title", name || "");
  }, [name, setValue]);

  // ✅ Handle thumbnail manually
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);
      setThumbnailFile(file);
      dispatch(setThumbnail({ file, preview }));
    }
  };

  const onSubmit = async (data) => {
    if (!data.title || !data.description || !thumbnailFile) {
      dispatch(setError("All fields are required"));
      return;
    }

    dispatch(setError(null));
    dispatch(setDetails({ title: data.title, description: data.description }));
    try {
      dispatch(setLoading(true));
      setLocalError("");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("videoFile", file);
      formData.append("thumbnail", thumbnailFile);

      const response = await VideoApi.uploadvideo(formData);
      const videoId = response.data.data._id;

      navigate(`/publish/${videoId}`);
      console.log("✅ Upload Success:", response);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setLocalError(message);
      dispatch(setError(message));
    }
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  };

  const handleCancel = () => {
    dispatch(clearVideo());
    navigate("/");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-800 text-white p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[600px] max-w-6xl w-full flex scroll-smooth flex-col border-2 border-gray-600 rounded-3xl overflow-hidden shadow-lg"
      >
        {/* HEADER */}
        <div className="h-[12%] w-full border-b border-gray-500 flex items-center justify-between px-6 bg-black/40">
          <h1 className="font-bold text-2xl">Upload Video Details</h1>
          <button
            type="button"
            onClick={handleCancel}
            className="hover:text-red-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

<div className="flex-1 overflow-y-auto pr-2 scrollbar-hide ">
<div className="sm:w-1/2 w-full h-full sm:border-r border-gray-600 p-6 flex flex-col">
            <label className="text-2xl font-semibold mb-4">
              Video Information
            </label>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
              {/* TITLE */}
              <input
                type="text"
                placeholder="Enter video title"
                {...register("title", { required: "Title is required" })}
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-transparent 
                hover:border-white focus:border-white focus:ring-0 outline-none transition-colors"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.title.message}
                </p>
              )}

              {/* DESCRIPTION */}
              <textarea
                placeholder="Write your video description..."
                {...register("description", {
                  required: "Description is required",
                })}
                rows="6"
                className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white border border-transparent 
                hover:border-white focus:border-white focus:ring-0 outline-none transition-colors resize-none"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.description.message}
                </p>
              )}

              {/* THUMBNAIL — MANUAL INPUT */}
              <label className="text-sm font-semibold mb-2">Thumbnail</label>
              <label
                htmlFor="thumbnailUpload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 
                rounded-xl p-6 cursor-pointer hover:border-white focus-within:border-white transition-all"
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="rounded-lg max-h-48 object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus size={48} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      Click to upload thumbnail
                    </p>
                  </>
                )}
                <input
                  type="file"
                  id="thumbnailUpload"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>

              {!thumbnailFile && (
                <p className="text-red-500 text-sm mt-2">
                  Thumbnail is required
                </p>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>

          {/* RIGHT SIDE — VIDEO PREVIEW */}
<div className="sm:w-1/2 w-full h-[300px] sm:h-full flex items-center justify-center p-6 sm:mt-0 mt-4">
            {videourl ? (
              <video
                src={videourl}
                controls
                className="w-full h-full object-contain rounded-xl border border-gray-700"
              ></video>
            ) : (
              <p className="text-gray-400">No video uploaded yet</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full border-t border-gray-600 flex justify-end px-8 py-4 bg-black/40">
          {(localError || error) && (
            <p className="text-red-500 text-sm mb-2 self-start">
              {localError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Confirm & Upload"}
          </button>
        </div>
      </form>
      {loading && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center">
          <div className="text-white text-xl">uplaoding Video...</div>
        </div>
      )}
    </div>
  );
}

export default VideoDetails;
