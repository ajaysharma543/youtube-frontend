import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlaylist,
  getUserPlaylists,
  setPlaylistError,
} from "../../../redux/features/playlist";
import Showplaylist from "./showplaylist";
import WatchApi from "../../../api/watchlater";

function Playlist({ video, children }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [createPlaylistMenu, setcreatePlaylistMenu] = useState(false);
  const dropdownRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setShowPlaylistMenu(false);
        setcreatePlaylistMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (user?._id) {
      dispatch(getUserPlaylists(user._id));
    }
  }, [user, dispatch]);

  const onSubmit = async (data) => {
    try {
      const formdata = new FormData();
      formdata.append("name", data.name);
      formdata.append("description", data.description);

      await dispatch(createPlaylist(formdata));
      await dispatch(getUserPlaylists(user._id));

      setShowPlaylistMenu(true);
      setcreatePlaylistMenu(false);
      setOpen(false);

      reset();
    } catch (error) {
      dispatch(setPlaylistError(error.message));
    } finally {
      setcreatePlaylistMenu(false);
    }
  };

  const watchlater = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await WatchApi.addToWatchLater(video._id);
      console.log("res", res.data.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative pl-4" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
            setShowPlaylistMenu(false);
            setcreatePlaylistMenu(false);
          }}
          className="text-white cursor-pointer w-3 text-2xl hover:text-gray-300"
        >
          ⋮
        </button>

        {open && !showPlaylistMenu && !createPlaylistMenu && (
          <div className="absolute -top-8 right-6 mt-2 w-44 bg-[#222222] text-white rounded-xl shadow-lg border border-gray-700 z-9999">
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#333333] transition-colors"
              onClick={(e) => {
                (setOpen(false), watchlater(e));
              }}
            >
              ▶️ Watch Later
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-[#333333] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistMenu(true);
                setcreatePlaylistMenu(false);
                setOpen(false);
              }}
            >
              💾 Save to Playlist
            </button>
            {children}
          </div>
        )}

        {showPlaylistMenu && (
          <div className="absolute -top-45 right-0 mt-2 w-52 bg-[#222222] border border-gray-700 rounded-xl shadow-lg z-[60] text-white">
            <p className="px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
              Choose Playlist
            </p>
            <Showplaylist video={video} />
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#333333] text-green-400 border-t border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistMenu(false);
                setcreatePlaylistMenu(true);
                setOpen(false);
              }}
            >
              ➕ Create New Playlist
            </button>
          </div>
        )}

        {createPlaylistMenu && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="absolute -top-100 right-30 mt-2 w-64 bg-[#222222] border border-gray-700 rounded-xl shadow-lg z-[60] text-white p-4 space-y-3"
          >
            <p className="text-gray-400 text-sm border-b border-gray-700 pb-2">
              New Playlist
            </p>

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300">Name</label>
              <input
                {...register("name", { required: true })}
                className="bg-[#333333] text-white rounded px-2 py-1 outline-none"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-300">Description</label>
              <input
                {...register("description")}
                className="bg-[#333333] text-white rounded px-2 py-1 outline-none"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                className="px-3 py-1 bg-[#333333] rounded text-gray-300 hover:bg-[#444444]"
                onClick={() => setcreatePlaylistMenu(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Playlist;
