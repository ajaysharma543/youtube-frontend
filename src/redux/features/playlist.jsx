import { createSlice } from "@reduxjs/toolkit";
import playlistApi from "../../api/playlist";

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPlaylistState: (state, action) => {
      state.list = action.payload;
    },
    setPlaylistLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPlaylistError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPlaylistState, setPlaylistLoading, setPlaylistError } =
  playlistSlice.actions;

export default playlistSlice.reducer;

export const createPlaylist = (data) => async (dispatch) => {
  try {
    dispatch(setPlaylistLoading(true));
    const res = await playlistApi.createplaylist(data);
    const newPlaylist = res.data.data;
    dispatch(setPlaylistState(newPlaylist));
    return newPlaylist;
  } catch (error) {
    dispatch(setPlaylistError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setPlaylistLoading(false));
  }
};

export const getUserPlaylists = (userId) => async (dispatch) => {
  try {
    dispatch(setPlaylistLoading(true));
    const res = await playlistApi.getUserPlaylists(userId);
    const playlistData = res.data.data; // array
    dispatch(setPlaylistState(playlistData));
    return playlistData;
  } catch (error) {
    dispatch(setPlaylistError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setPlaylistLoading(false));
  }
};

export const addVideoToPlaylist =
  (playlistId, videoId) => async (dispatch, getState) => {
    try {
      dispatch(setPlaylistLoading(true));
      const res = await playlistApi.addVideoToPlaylist({ playlistId, videoId });
      const updatedPlaylist = res.data.data;
      console.log("play", updatedPlaylist);
      const { list } = getState().playlist;
      const updatedList = list.map((p) =>
        p._id === updatedPlaylist._id ? updatedPlaylist : p
      );
      console.log("playlist", updatedList);
      dispatch(setPlaylistState(updatedList));
      return updatedList;
    } catch (error) {
      dispatch(
        setPlaylistError(error.response?.data?.message || error.message)
      );
    } finally {
      dispatch(setPlaylistLoading(false));
    }
  };
