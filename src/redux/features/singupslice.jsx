import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullname: "",
  username: "",
  avatar: null,
  coverImage: null,
  email: "",
  password: "",
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // Step 1
    setBasicInfo: (state, action) => {
      const { fullname, username, avatar, coverImage } = action.payload;
      state.fullname = fullname;
      state.username = username;
      state.avatar = avatar;
      state.coverImage = coverImage;
    },

    // Step 2
    setEmail: (state, action) => {
      state.email = action.payload.email;
    },

    // Step 3
    setPassword: (state, action) => {
      state.password = action.payload.password;
    },

    // Optional combined setter
    setCredentials: (state, action) => {
      const { email, password } = action.payload;
      state.email = email;
      state.password = password;
    },

    resetSignup: () => initialState,
  },
});

export const {
  setBasicInfo,
  setEmail,
  setPassword,
  setCredentials,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;
