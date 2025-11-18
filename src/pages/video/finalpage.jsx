import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  clearVideo,
  setError,
  setLoading,
} from "../../redux/features/videoslice";
import VideoApi from "../../api/videoapi";

function Finalpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    title,
    description,
    videourl,
    thumbnail,
    file,
    loading,
    error,
    thumbnailUrl,
  } = useSelector((state) => state.video);

  const [localError, setLocalError] = useState("");

  const onsubmit = async () => {
    try {
      dispatch(setLoading(true));
      setLocalError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", file);
      formData.append("thumbnail", thumbnail);

      const response = await VideoApi.uploadvideo(formData);

      console.log("✅ Upload Success:", response);
      dispatch(clearVideo());
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClose = () => {
    dispatch(clearVideo());
    navigate("/publish");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-800 text-white p-8">
      <div className="h-[650px] max-w-6xl w-full flex flex-col border-2 border-gray-600 rounded-3xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="h-[10%] w-full border-b border-gray-500 flex items-center justify-between px-6 bg-black/40">
          <h1 className="font-bold text-2xl">Preview Before Upload</h1>
          <button
            onClick={handleClose}
            className="hover:text-red-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[85%] grid grid-cols-2 gap-6 p-6 overflow-y-auto scrollbar-hide">
          {/* Left Section */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-semibold mb-2 text-blue-400">
              {title || "No Title Provided"}
            </h2>

            <p className="text-gray-300 text-base leading-relaxed border border-gray-700 rounded-xl p-4 bg-black/40">
              {description || "No Description Provided"}
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-400">
                Thumbnail Preview
              </h3>

              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="rounded-xl max-h-48 object-cover border border-gray-600"
                />
              ) : thumbnail ? (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail"
                  className="rounded-xl max-h-48 object-cover border border-gray-600"
                />
              ) : (
                <p className="text-gray-500">No thumbnail selected</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center justify-center">
            {videourl ? (
              <video
                src={videourl}
                controls
                className="w-full h-[400px] object-contain rounded-xl border border-gray-600"
              ></video>
            ) : (
              <p className="text-gray-500">No video uploaded</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-[13%] border-t border-gray-600 flex flex-col justify-center items-end px-8 py-4 bg-black/40">
          {(localError || error) && (
            <p className="text-red-500 text-sm mb-2 self-start">
              {localError || error}
            </p>
          )}

          <button
            onClick={onsubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Confirm & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Finalpage;
