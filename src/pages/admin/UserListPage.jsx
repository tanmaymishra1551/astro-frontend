// src/pages/UserListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        // Build query parameters based on filters
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (roleFilter) queryParams.append('role', roleFilter);
        if (statusFilter) queryParams.append('status', statusFilter);

        try {
            const response = await fetch(`/api/admin/users/?${queryParams.toString()}`);
            const result = await response.json();
            if (result.success) {
                setUsers(result.data);
            } else {
                console.error('Failed to retrieve users:', result.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full sm:w-auto"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="astrologer">Astrologer</option>
                    <option value="end_user">End User</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
                <Link
                    to="/admin/users/create"
                    className="bg-blue-500 text-white p-2 rounded text-center"
                >
                    Create User
                </Link>
            </div>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Full Name</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Role</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border">{user.fullname}</td>
                                <td className="py-2 px-4 border">{user.email}</td>
                                <td className="py-2 px-4 border">{user.role || 'N/A'}</td>
                                <td className="py-2 px-4 border">{user.status || 'N/A'}</td>
                                <td className="py-2 px-4 border space-x-2">
                                    <Link to={`/admin/users/${user.id}`} className="text-blue-500">
                                        View
                                    </Link>
                                    <Link to={`/admin/users/${user.id}/edit`} className="text-green-500">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center p-4">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserListPage;
