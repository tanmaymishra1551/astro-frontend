// src/pages/UserEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const UserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'user',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`/api/admin/users/${id}`);
            const data = await response.json();
            console.log('User:', data.data.fullname);
            // Assuming the API returns user data with the key 'fullname'
            setFormData({
                fullName: data.data.fullname || '',
                email: data.data.email || '',
                phone: data.data.phone || '',
                role: data.data.role || 'user',
            });
        } catch (error) {
            console.error('Error fetching user detail:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user.');
            }
            // Redirect to the user's detail page after update
            navigate(`/admin/users/${id}`);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-4">
            <Link to={`/admin/users/${id}`} className="text-blue-500 mb-4 inline-block">
                Back to User Detail
            </Link>
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
                <div>
                    <label className="block font-medium">Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
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
                    <label className="block font-medium">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        <option value="admin">Admin</option>
                        <option value="astrologer">Astrologer</option>
                        <option value="user">End User</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded w-full"
                >
                    {loading ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </div>
    );
};

export default UserEditPage;
