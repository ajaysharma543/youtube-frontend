import axiosclient from "./api";

const commentApi = {
  getvideocomments: (videoId) => axiosclient.get(`/comments/${videoId}`),
  addcomment: (videoId, data) => axiosclient.post(`/comments/${videoId}`, data),
  editcomment: (commentId, data) =>
    axiosclient.patch(`/comments/X${commentId}`, data),
  deletecomment: (commentId) => axiosclient.delete(`/comments/${commentId}`),
};

export default commentApi;
