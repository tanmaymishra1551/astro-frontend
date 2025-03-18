// src/pages/UserCreationPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserCreationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        phone: '',
        password: '',
        role: 'end_user',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for required fields
        if (!formData.fullname || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/admin/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to create user.');
            }
            navigate('/admin/users');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-4">
            <Link to="/admin/users" className="text-blue-500 mb-4 inline-block">
                Back to User List
            </Link>
            <h1 className="text-2xl font-bold mb-4">Create New User</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
                <div>
                    <label className="block font-medium">Full Name *</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        <option value="admin">Admin</option>
                        <option value="astrologer">Astrologer</option>
                        <option value="end_user">End User</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded w-full"
                >
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default UserCreationPage;
