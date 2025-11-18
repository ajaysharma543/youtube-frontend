import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadIcon, X } from "lucide-react";
import {
  setVideo,
  setLoading,
  setError,
  clearVideo,
} from "../../redux/features/videoslice";

function Videouploads() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.video);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      dispatch(setError("Please select a video file"));
      return;
    }

    if (!file.type.startsWith("video/")) {
      dispatch(setError("Only video files are allowed"));
      return;
    }

    const preview = URL.createObjectURL(file);
    dispatch(setVideo({ file, preview }));
    dispatch(setError(null));

    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
      navigate("/video-details");
    }, 2000);
  };

  const cancel = () => {
    dispatch(setLoading(true));
    dispatch(clearVideo());
    setTimeout(() => {
      dispatch(setLoading(false));
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-800 text-white p-8">
      <div className="h-[600px] max-w-6xl w-full flex flex-col border-2 border-gray-600 rounded-3xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="h-[10%] w-full border-b border-gray-500 flex items-center justify-between px-6 bg-black/40">
          <h1 className="font-bold text-2xl">Upload Videos</h1>
          <button
            className="hover:text-red-500 transition-colors"
            onClick={cancel}
          >
            <X size={28} />
          </button>
        </div>

        <div className="h-[90%] flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <div className="animate-pulse text-gray-400 text-xl">
              Uploading...
            </div>
          ) : (
            <>
              <label
                htmlFor="videoUpload"
                className="w-2/4 h-2/4 flex flex-col items-center justify-center rounded-2xl cursor-pointer"
              >
                <div className="bg-gray-600 rounded-full p-6 mb-2 flex items-center justify-center hover:bg-gray-700/30 transition-all">
                  <UploadIcon className="h-16 w-16" />
                </div>

                <input
                  type="file"
                  id="videoUpload"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <p className="text-lg font-semibold mb-2">
                Click or Drag to Upload Video
              </p>
              <p className="text-sm text-gray-400">
                Your videos are private until you publish them
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Videouploads;
