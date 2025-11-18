import axiosclient from "./api";

const WatchApi = {
  addToWatchLater: (videoId) => axiosclient.post(`/watchlater/add/${videoId}`),
  removeFromWatchLater: (videoId) =>
    axiosclient.delete(`/watchlater/remove/${videoId}`),
  getwatchlater: () => axiosclient.get(`/watchlater/`),
};

export default WatchApi;
