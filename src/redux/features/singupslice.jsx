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
