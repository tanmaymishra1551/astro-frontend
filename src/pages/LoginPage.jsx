import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const LoginPage = () => {
    const [form, setForm] = useState({ phone: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Login failed");

            dispatch(loginSuccess(result.data.user));
            toast.success("Login successful!");

            const dashboardRoutes = {
                user: "/user-dashboard",
                astrologer: "/astrologer-dashboard",
                admin: "/admin-dashboard",
            };

            navigate(dashboardRoutes[result.data.user.role] || "/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0132] to-[#090114] text-white px-4">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="absolute top-10 left-8 animate-bounce text-purple-400 text-3xl">🌙</span>
                <span className="absolute bottom-10 right-8 animate-pulse text-yellow-400 text-2xl">🔮</span>
                <span className="absolute top-20 right-4 animate-spin text-blue-400 text-xl">⭐</span>
            </div>

            <div className="bg-[#1e0836] p-6 rounded-lg shadow-xl w-full max-w-sm border border-purple-500">
                <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "phone", placeholder: "Phone Number", icon: "📞", type: "tel" },
                        { name: "password", placeholder: "Password", icon: "🔑", type: "password" },
                    ].map(({ name, placeholder, icon, type }) => (
                        <div key={name} className="relative">
                            <input
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                value={form[name]}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-[#2a0c4e] border border-purple-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 pl-12 transition"
                                required
                            />
                            <span className="absolute left-3 top-3 text-yellow-400">{icon}</span>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full p-3 bg-gradient-to-r from-purple-500 to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:from-yellow-400 hover:to-purple-500 transition disabled:opacity-50"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")} className="text-blue-400 cursor-pointer hover:underline">
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
