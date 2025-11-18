import { createSlice } from "@reduxjs/toolkit";
import dislikeapi from "../../api/dislike";
const dislikeSlice = createSlice({
  name: "dislikes",
  initialState: {
    byVideoId: {}, // store dislike state per video
    loading: false,
    error: null,
  },
  reducers: {
    setDislikeState: (state, action) => {
      const { videoId, isDisliked, dislikeCount, likeCount } = action.payload;
      state.byVideoId[videoId] = { isDisliked, dislikeCount, likeCount };
    },
    setDislikeLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDislikeError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setDislikeState, setDislikeLoading, setDislikeError } =
  dislikeSlice.actions;

// ✅ Toggle dislike
export const toggleDislikes = (videoId) => async (dispatch) => {
  try {
    dispatch(setDislikeLoading(true));
    const res = await dislikeapi.toggleVideodisLike(videoId);
    const { isDisliked, dislikeCount, likeCount } = res.data?.data || {};

    // ✅ Update both counts here too
    dispatch(setDislikeState({ videoId, isDisliked, dislikeCount, likeCount }));
  } catch (error) {
    console.error(error);
    dispatch(setDislikeError(error.message));
  } finally {
    dispatch(setDislikeLoading(false));
  }
};

// ✅ Fetch current dislike status
export const fetchDislikeStatus = (videoId) => async (dispatch) => {
  try {
    dispatch(setDislikeLoading(true));
    const res = await dislikeapi.getVideoDislikeStatus(videoId);
    const { isDisliked, dislikeCount, likeCount } = res.data?.data || {};
    dispatch(setDislikeState({ videoId, isDisliked, dislikeCount, likeCount }));
  } catch (error) {
    console.error(error);
    dispatch(setDislikeError(error.message));
  } finally {
    dispatch(setDislikeLoading(false));
  }
};

export default dislikeSlice.reducer;
