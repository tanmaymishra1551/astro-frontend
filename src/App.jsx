import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import VoicePage from "./pages/VoicePage.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import CallerVideoPage from "./pages/CallerVideoPage.jsx";
import CalleeVideoPage from "./pages/CalleeVideoPage.jsx";

// Lazy imports
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.jsx"));
const AstrologerDashboard = lazy(() => import("./pages/AstrologerDashboard.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const BookingDetail = lazy(() => import("./pages/BookingDetail.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const PaymentPage = lazy(() => import("./pages/PaymentPage.jsx"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const SupportPage = lazy(() => import("./pages/SupportPage.jsx"));

// Private route
function PrivateRoute({ element }) {
  const { loggedIn } = useSelector((state) => state.auth);
  const isAuthenticated = loggedIn?.accessToken;
  return isAuthenticated ? element : <Navigate to="/login" />;
}

// Routes
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/voice", element: <VoicePage /> },
  { path: "/video", element: <VideoPage /> },
  { path: "/caller-video", element: <CallerVideoPage /> },
  { path: "/callee-video", element: <CalleeVideoPage /> },
];

const protectedRoutes = [
  { path: "/user-dashboard", element: <UserDashboard /> },
  { path: "/astrologer-dashboard", element: <AstrologerDashboard /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/booking/:id", element: <BookingDetail /> },
  { path: "/chat/:id", element: <ChatPage /> },
  { path: "/payment", element: <PaymentPage /> },
  { path: "/admin/*", element: <UserManagement /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/support", element: <SupportPage /> },
];

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div className="text-white text-center mt-20">🔮 Loading magical experience...</div>}>
        <Routes>
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute element={element} />} />
          ))}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
