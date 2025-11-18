import axiosclient from "./api";

const dislikeapi = {
  toggleVideodisLike: (videoId) =>
    axiosclient.post(`/dislike/toggle-video/${videoId}`),
  getVideoDislikeStatus: (videoId) =>
    axiosclient.get(`/dislike/toggle-video/${videoId}`),
  toggleCommentDislike: (commentId) =>
    axiosclient.post(`/dislike/toggle-comment/${commentId}`),

  getCommentDislikeStatus: (commentId) =>
    axiosclient.get(`/dislike/toggle-comment/${commentId}`),
};
export default dislikeapi;
