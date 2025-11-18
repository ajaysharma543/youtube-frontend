import axiosclient from "./api";

const playlistApi = {
  createplaylist: (data) => axiosclient.post(`/playlist/create`, data),
  getUserPlaylists: (userId) => axiosclient.get(`/playlist/users/${userId}`),
  addVideoToPlaylist: ({ playlistId, videoId }) =>
    axiosclient.patch(`/playlist/${playlistId}/addvideo/${videoId}`),
  removeVideoFromPlaylist: ({ playlistId, videoId }) =>
    axiosclient.patch(`/playlist/${playlistId}/removevideo/${videoId}`),
  deleteToPlaylist: ({ playlistId }) =>
    axiosclient.delete(`/playlist/${playlistId}`),
  getPlaylistById: (playlistId) => axiosclient.get(`/playlist/${playlistId}`),
  editPlaylist: ({ playlistId }, data) =>
    axiosclient.patch(`/playlist/${playlistId}`, data),
};

export default playlistApi;
