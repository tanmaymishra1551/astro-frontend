import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const UserCreationPage = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        role: "end_user",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullname || !formData.email || !formData.password) {
            setError("Please fill in all required fields.");
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Failed to create user.");
            }
            navigate("/admin/users");
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-[1px] z-50">
            <div className="w-full max-w-lg bg-[#1e0138] p-8 rounded-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white text-lg font-bold"
                >
                    ✕
                </button>
                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Create New User</h1>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-yellow-400">Full Name *</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
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
                        <label className="block font-medium text-yellow-400">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
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
                        <label className="block font-medium text-yellow-400">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
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
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreationPage;
