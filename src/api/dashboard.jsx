import axiosclient from "./api";

const dashbaordApi = {
  dashboardvidoes: () => axiosclient.get("/dashboard/videos"),
  dashboardstats: () => axiosclient.get("/dashboard/stats"),
};

export default dashbaordApi;
