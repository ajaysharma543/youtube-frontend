import { createSlice } from "@reduxjs/toolkit";
import likeApi from "../../api/like";

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    byVideoId: {},
    loading: false,
    error: null,
  },
  reducers: {
    setLikeState: (state, action) => {
      const { videoId, isLiked, likeCount, dislikeCount } = action.payload;
      state.byVideoId[videoId] = { isLiked, likeCount, dislikeCount };
    },
    setLikeLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLikeError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLikeState, setLikeLoading, setLikeError } =
  likesSlice.actions;

export const togglelikes = (videoId) => async (dispatch) => {
  try {
    dispatch(setLikeLoading(true));
    const res = await likeApi.toggleVideoLike(videoId);
    const { isLiked, likeCount, dislikeCount } = res.data?.data || {};
    dispatch(setLikeState({ videoId, isLiked, likeCount, dislikeCount }));
  } catch (error) {
    console.error(error);
    dispatch(setLikeError(error.message));
  } finally {
    dispatch(setLikeLoading(false));
  }
};

export const fetchLikeStatus = (videoId) => async (dispatch) => {
  try {
    dispatch(setLikeLoading(true));
    const res = await likeApi.getVideoLikeStatus(videoId);
    const { isLiked, likeCount, dislikeCount } = res.data?.data || {};
    dispatch(setLikeState({ videoId, isLiked, likeCount, dislikeCount }));
  } catch (error) {
    console.error(error);
    dispatch(setLikeError(error.message));
  } finally {
    dispatch(setLikeLoading(false));
  }
};

export default likesSlice.reducer;
