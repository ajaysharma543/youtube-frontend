import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  allVideos: [],       
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = "";
    },
    setAllVideos: (state, action) => {
      state.allVideos = action.payload;
    },
  },
});

export const { setSearchQuery, clearSearchQuery, setAllVideos } =
  searchSlice.actions;

export default searchSlice.reducer;

