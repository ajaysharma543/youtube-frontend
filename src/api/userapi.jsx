import axiosclient from "./api";

const authApi = {
  signup: (data) => axiosclient.post("/users/register", data),
  login: (data) => axiosclient.post("/users/login", data),
  getcurrentuser: () => axiosclient.get("/users/getcurrent-user"),
  logout: () => axiosclient.post("/users/logout"),
  changeavatar: (data) => axiosclient.patch("users/change-avatar", data),
  coverimage: (data) => axiosclient.patch("users/change-coverimage", data),
  userdetails: (data) => axiosclient.patch("users/change-accountdetails", data),
  changepassword: (data) => axiosclient.patch("users/change-password", data),
  resetPassword: (data) => axiosclient.post("/users/reset-password", data),
  getwatchhistory: () => axiosclient.get("/users/watch-history"),
  deletewatchhistory: (videoId) =>
    axiosclient.delete(`/users/delete-history/${videoId}`),
  deleteallwatchhistory: () => axiosclient.delete("/users/delete-history"),
  getUserChannelProfile: (username) => axiosclient.get(`users/c/${username}`),
  description: (data) => axiosclient.patch("users/description", data),
};

export default authApi;
