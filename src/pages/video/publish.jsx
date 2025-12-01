import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import VideoApi from "../../api/videoapi";
import { setError, setLoading } from "../../redux/features/videoslice";

function PublishPage() {
  const [publish, setPublish] = useState("public");
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videoId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    try {
      dispatch(setLoading(true));
      setLocalError("");
      dispatch(setError(null));

      if (publish === "public") {
        const response = await VideoApi.publishvideo(videoId);
        // console.log("✅ Video published:", response.data);
        navigate("/");
      } else {
        // console.log("Video set as private, skipping publish API.");
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black to-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700 rounded-3xl p-10 w-full max-w-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose Video Visibility
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label
            className={`flex items-center justify-between px-6 py-4 border rounded-2xl cursor-pointer transition-all ${
              publish === "public"
                ? "border-green-500 bg-green-900/20"
                : "border-gray-600 hover:border-green-600"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xl font-semibold">Public</span>
              <span className="text-sm text-gray-400">
                Everyone can see your video
              </span>
            </div>
            <input
              type="radio"
              value="public"
              checked={publish === "public"}
              {...register("visibility", { required: "Select one option" })}
              onChange={(e) => setPublish(e.target.value)}
              className="w-5 h-5 accent-green-500"
            />
          </label>

          <label
            className={`flex items-center justify-between px-6 py-4 border rounded-2xl cursor-pointer transition-all ${
              publish === "private"
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-600 hover:border-blue-600"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xl font-semibold">Private</span>
              <span className="text-sm text-gray-400">
                Only you can see this video
              </span>
            </div>
            <input
              type="radio"
              value="private"
              checked={publish === "private"}
              {...register("visibility", { required: "Select one option" })}
              onChange={(e) => setPublish(e.target.value)}
              className="w-5 h-5 accent-blue-500"
            />
          </label>

          {errors.visibility && (
            <p className="text-red-500 text-sm">{errors.visibility.message}</p>
          )}

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-lg font-semibold transition-all"
            >
              Continue
            </button>
          </div>

          {localError && (
            <p className="text-red-500 text-center mt-3">{localError}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default PublishPage;
