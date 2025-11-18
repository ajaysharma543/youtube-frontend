import axiosclient from "./api";

const VideoApi = {
  getallvideos: (params) => axiosclient.get("/video/all-videos", { params }),
  uploadvideo: (data) => axiosclient.post("/video/upload", data),
  publishvideo: (videoId) =>
    axiosclient.patch(`/video/toggle-publish/${videoId}`),
  updateVideo: (videoId, data) =>
    axiosclient.patch(`/video/v/${videoId}`, data),
  deletevideo: (videoId) => axiosclient.delete(`/video/v/${videoId}`),
  getVideoById: (videoId) => axiosclient.get(`/video/v/${videoId}`),
  getchanneldetails: () => axiosclient.get(`/video/channeldetails`),
};

export default VideoApi;
