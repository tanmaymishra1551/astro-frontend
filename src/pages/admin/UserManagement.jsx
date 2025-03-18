// src/pages/admin/UserManagement.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserListPage from './UserListPage.jsx';
import UserDetailPage from './UserDetailPage.jsx';
import UserCreationPage from './UserCreationPage.jsx';
import UserEditPage from './UserEditPage.jsx';

function UserManagement() {
    return (
        <Routes>
            <Route path="users" element={<UserListPage />} />
            <Route path="users/create" element={<UserCreationPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="users/:id/edit" element={<UserEditPage />} />
        </Routes>
    );
}

export default UserManagement;
