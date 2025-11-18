import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import signupReducer from "../features/singupslice";
import videoReducer from "../features/videoslice";
import userReducer from "../features/userdetailsslice";
import getvideoReducer from "../features/fetchvideoslice";
import subscriberReducer from "../features/subscription";
import likeReducer from "../features/likes";
import dislikeReducer from "../features/disliked";
import playlistReducer from "../features/playlist";

const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    video: videoReducer,
    user: userReducer,
    videos: getvideoReducer,
    subscriber: subscriberReducer,
    like: likeReducer,
    dislike: dislikeReducer,
    playlist: playlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
