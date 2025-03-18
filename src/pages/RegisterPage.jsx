import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;
console.log(`API_BASE_URL: ${API_BASE_URL}`);
function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        username: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // console.log("Registration successful:", data);
                // Redirect based on user role
                if (formData.role === "user") {
                    navigate("/user-dashboard");
                } else if (formData.role === "astrologer") {
                    navigate("/astrologer-dashboard");
                } else if (formData.role === "admin") {
                    navigate("/admin-dashboard");
                }
            } else {
                console.error("Registration failed:", data);
                // Handle errors (e.g., show error messages to the user)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="astrologer">Astrologer</option>
                </select>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;
