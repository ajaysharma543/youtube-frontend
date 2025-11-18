import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: null,
  videourl: null,
  name: "",
  title: "",
  description: "",
  thumbnail: null,
  thumbnailUrl: null,
  loading: false,
  error: null,
};

const videoslice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.file = action.payload.file;
      state.videourl = action.payload.preview;
      state.name = action.payload.file?.name || "";
    },

    setDetails: (state, action) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
    },

    setThumbnail: (state, action) => {
      state.thumbnail = action.payload.file;
      state.thumbnailUrl = action.payload.preview;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearVideo: (state) => {
      state.file = null;
      state.videourl = null;
      state.name = "";
      state.title = "";
      state.description = "";
      state.thumbnail = null;
      state.thumbnailUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setVideo,
  setDetails,
  setThumbnail,
  setLoading,
  setError,
  clearVideo,
} = videoslice.actions;

export default videoslice.reducer;
