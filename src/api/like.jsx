import axiosclient from "./api";

const likeApi = {
  toggleVideoLike: (videoId) =>
    axiosclient.post(`/like/toggle-video/${videoId}`),
  getVideoLikeStatus: (videoId) =>
    axiosclient.get(`/like/toggle-video/${videoId}`),
  togglecommentLike: (videoId) =>
    axiosclient.post(`/like/toggle-comment/${videoId}`),
  getCommentLikeStatus: (commentId) =>
    axiosclient.get(`/like/toggle-comment/${commentId}`),
  getLikedVideos: () => axiosclient.get(`like/videos`),
};

export default likeApi;
