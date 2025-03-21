import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;
import UserCreationPage from './UserCreationPage.jsx';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (roleFilter) queryParams.append('role', roleFilter);
        if (statusFilter) queryParams.append('status', statusFilter);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/?${queryParams.toString()}`);
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
            <div className="p-6 bg-[#1e0138] text-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-yellow-400">User Management</h1>

                {/* Filters and Create Button */}
                <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded w-full sm:w-auto"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="astrologer">Astrologer</option>
                        <option value="end_user">End User</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded text-center font-semibold"
                    >
                        Create User
                    </button>
                    {isModalOpen && (<UserCreationPage isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />)}
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-900 border border-gray-700 text-white rounded-lg">
                        <thead>
                            <tr className="bg-gray-800 text-yellow-300">
                                <th className="py-3 px-4 border border-gray-700">Full Name</th>
                                <th className="py-3 px-4 border border-gray-700">Email</th>
                                <th className="py-3 px-4 border border-gray-700">Role</th>
                                <th className="py-3 px-4 border border-gray-700">Status</th>
                                <th className="py-3 px-4 border border-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-800">
                                        <td className="py-3 px-4 border border-gray-700">{user.fullname}</td>
                                        <td className="py-3 px-4 border border-gray-700">{user.email}</td>
                                        <td className="py-3 px-4 border border-gray-700">{user.role || 'N/A'}</td>
                                        <td className="py-3 px-4 border border-gray-700">{user.status || 'N/A'}</td>
                                        <td className="py-3 px-4 border border-gray-700 space-x-3">
                                            <Link to={`/admin/users/${user.id}`} className="text-yellow-400 hover:underline">
                                                View
                                            </Link>
                                            <Link to={`/admin/users/${user.id}/edit`} className="text-green-400 hover:underline">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-yellow-300">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
    );
};

export default UserListPage;
