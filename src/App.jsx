// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const UserDashboard = lazy(() => import('./pages/UserDashboard.jsx'));
const AstrologerDashboard = lazy(() => import('./pages/AstrologerDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const BookingDetail = lazy(() => import('./pages/BookingDetail.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));
const PaymentPage = lazy(() => import('./pages/PaymentPage.jsx'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'));

function PrivateRoute({ element }) {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/login" />;
}

const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];

const protectedRoutes = [
  { path: '/user-dashboard', element: <UserDashboard /> },
  { path: '/astrologer-dashboard', element: <AstrologerDashboard /> },
  { path: '/admin-dashboard', element: <AdminDashboard /> },
  { path: '/booking/:id', element: <BookingDetail /> },
  { path: '/chat/:id', element: <ChatPage /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/admin/*', element: <UserManagement /> },
];

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
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
    </div>
  );
}

export default App;
