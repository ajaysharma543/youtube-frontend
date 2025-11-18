import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import DashboardLayout from "./pages/dashboard/dashboard_layout";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import authApi from "./api/userapi";
import SignupStep2 from "./pages/auth/emails";
import Password from "./pages/auth/password";
import Videouploads from "./pages/video/videouploads";
import VideoUpload from "./pages/video/title_Description";
import PublishPage from "./pages/video/publish";
import Profile from "./pages/profile/profile";
import ProfileDashboardLayout from "./pages/profile/profile_dashboard/dashboard";
import Resetpassword from "./pages/auth/resetpassword";
import New_password from "./pages/auth/new password";
import CustomizeChannel from "./pages/profile/channel_customize/channel_customize";
import Content from "./pages/profile/content/content";
import Edit from "./pages/profile/content/edit";
import Dashboardpage from "./pages/profile/dashboard/dashboard";
import VideoDashboardLayout from "./pages/playvideo_dahboard/dashboard_layout";
import Mainvideo_page from "./pages/playvideo_dahboard/mainvideo_page";
import History from "./pages/dashboard/history";
import Playlistdashboard from "./pages/dashboard/playlistdashboard";
import Liked from "./pages/dashboard/liked";
import Playlist from "./pages/dashboard/playlistshow/playlist";
import Watchlater from "./pages/dashboard/playlistshow/watchlater";
import PlaylistVideos from "./pages/dashboard/playlistshow/getplaylistbyid";
import Subscriptondash from "./pages/dashboard/subscription/subscriptondash";
import ChannelPage from "./pages/dashboard/channelshow";
import Allsubscriptions from "./pages/dashboard/subscription/allsubscriptions";
import Mianyou from "./pages/dashboard/mianyou";
import Seting from "./pages/dashboard/seting";
function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await authApi.getcurrentuser();

        if (
          location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/signup-email" ||
          location.pathname === "/set-password"
        ) {
          navigate("/");
        }
      } catch (err) {
        console.error(
          "❌ No active session:",
          err.response?.data || err.message
        );

        const protectedRoutes = [
          "/upload",
          "/video-details",
          "/publish",
          "/profile",
        ];
        if (
          protectedRoutes.some((path) => location.pathname.startsWith(path))
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate, location.pathname]);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />
      <Route
        path="/History"
        element={
          <DashboardLayout>
            <History />
          </DashboardLayout>
        }
      />
      <Route
        path="/Playlist"
        element={
          <DashboardLayout>
            <Playlist />
          </DashboardLayout>
        }
      />
      <Route
        path="/Playlist/show/:playlistId"
        element={
          <DashboardLayout>
            <PlaylistVideos />
          </DashboardLayout>
        }
      />
      <Route
        path="/watchlater"
        element={
          <DashboardLayout>
            <Watchlater />
          </DashboardLayout>
        }
      />
      <Route
        path="/liked"
        element={
          <DashboardLayout>
            <Liked />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <Seting />
          </DashboardLayout>
        }
      />
      <Route
        path="/Subscription"
        element={
          <DashboardLayout>
            <Subscriptondash />
          </DashboardLayout>
        }
      />
      <Route
        path="/mainyou"
        element={
          <DashboardLayout>
            <Mianyou />
          </DashboardLayout>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <DashboardLayout>
            <Allsubscriptions />
          </DashboardLayout>
        }
      />
      <Route
        path="/c/:username"
        element={
          <DashboardLayout>
            <ChannelPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/channel-customize"
        element={
          <ProfileDashboardLayout>
            <CustomizeChannel />
          </ProfileDashboardLayout>
        }
      />
      <Route
        path="/content"
        element={
          <ProfileDashboardLayout>
            <Content />
          </ProfileDashboardLayout>
        }
      />
      <Route
        path="/edit_video/:videoId"
        element={
          <ProfileDashboardLayout>
            <Edit />
          </ProfileDashboardLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProfileDashboardLayout>
            <Dashboardpage />
          </ProfileDashboardLayout>
        }
      />
      <Route
        path="/video/:videoId"
        element={
          <VideoDashboardLayout>
            <Mainvideo_page />
          </VideoDashboardLayout>
        }
      />
      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-email" element={<SignupStep2 />} />
      <Route path="/set-password" element={<Password />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/resetpassword" element={<Resetpassword />} />
      <Route path="/login/newpassword" element={<New_password />} />
      {/* Video Upload Routes */}
      <Route path="/upload" element={<Videouploads />} />
      <Route path="/video-details" element={<VideoUpload />} />
      <Route path="/publish/:videoId" element={<PublishPage />} />
    </Routes>
  );
}

export default App;
