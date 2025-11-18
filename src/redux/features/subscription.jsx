import { createSlice } from "@reduxjs/toolkit";
import subscriberApi from "../../api/subscribers";

const subscriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    isSubscribed: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.loading = true;
      state.error = null;
    },

    setSubscriptionState: (state, action) => {
      state.isSubscribed = action.payload;
      state.loading = false;
    },

    toggleSubscriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  resetSubscriptionState,
  setSubscriptionState,
  toggleSubscriptionFailure,
} = subscriberSlice.actions;

export default subscriberSlice.reducer;

export const toggleSubscriptions = (channelId) => async (dispatch) => {
  try {
    dispatch(resetSubscriptionState());
    const res = await subscriberApi.subscribe(channelId);
    const subscribed = res.data?.data?.subscribe ?? false;
    dispatch(setSubscriptionState(subscribed));
    return subscribed;
  } catch (error) {
    dispatch(
      toggleSubscriptionFailure(
        error.response?.data?.message || "Failed to toggle subscription"
      )
    );
    throw error;
  }
};
