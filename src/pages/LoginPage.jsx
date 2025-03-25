import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const LoginPage = () => {
    const [form, setForm] = useState({ phone: "", password: "" }); // Updated to phone instead of username
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            const role = data.data.user.role;
            dispatch(loginSuccess(data));

            switch (role) {
                case "user":
                    navigate("/user-dashboard");
                    break;
                case "astrologer":
                    navigate("/astrologer-dashboard");
                    break;
                case "admin":
                    navigate("/admin-dashboard");
                    break;
                default:
                    navigate("/dashboard");
                    break;
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0132] to-[#090114] text-white px-4 sm:px-6 md:px-8">
            {/* Floating Astrology Icons */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="absolute top-10 left-8 md:left-16 animate-bounce text-purple-400 text-3xl sm:text-4xl">🌙</span>
                <span className="absolute bottom-10 right-8 md:right-16 animate-pulse text-yellow-400 text-2xl sm:text-3xl">🔮</span>
                <span className="absolute top-20 right-4 md:right-8 animate-spin text-blue-400 text-xl sm:text-2xl">⭐</span>
            </div>

            <div className="bg-[#1e0836] p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg border border-purple-500">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-4 sm:mb-6">Login</h2>

                {error && (
                    <p className="text-red-400 text-center text-sm sm:text-base mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[  
                        { name: "phone", placeholder: "Phone Number", icon: "📞", type: "tel" }, // Changed to phone
                        { name: "password", placeholder: "Password", icon: "🔑", type: "password" },
                    ].map(({ name, placeholder, icon, type }) => (
                        <div key={name} className="relative group">
                            <input
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#2a0c4e] border border-purple-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 pl-12 transition"
                                required
                            />
                            <span className="absolute left-3 top-3 text-yellow-400 group-focus-within:translate-x-1 transition">
                                {icon}
                            </span>
                        </div>
                    ))}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-gradient-to-r from-purple-500 to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:from-yellow-400 hover:to-purple-500 transition relative disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-400 cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
