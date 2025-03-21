import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const UserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'end_user',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`);
            const data = await response.json();
            setFormData({
                fullName: data.data.fullname || '',
                email: data.data.email || '',
                phone: data.data.phone || '',
                role: data.data.role || 'end_user',
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
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user.');
            }
            navigate(`/admin/users/${id}`);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-[1px] z-50">
            <div className="w-full max-w-lg bg-[#1e0138] p-8 rounded-lg shadow-lg relative">
                <Link
                    to={`/admin/users/${id}`}
                    className="absolute top-3 left-4 text-yellow-400 text-lg font-bold"
                >
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Edit User</h1>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-yellow-400">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border border-yellow-400 bg-[#2c024b] p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-yellow-400">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-yellow-400 bg-[#2c024b] p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-yellow-400">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border border-yellow-400 bg-[#2c024b] p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-yellow-400">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="border border-yellow-400 bg-[#2c024b] p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="admin">Admin</option>
                            <option value="astrologer">Astrologer</option>
                            <option value="end_user">End User</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${id}`)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                        >
                            {loading ? "Updating..." : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditPage;
