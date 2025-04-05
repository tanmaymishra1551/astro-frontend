import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Registered successfully!");
                navigate("/login");
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0132] to-[#090114] text-white px-4">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="absolute top-10 left-8 md:left-16 animate-bounce text-purple-400 text-3xl sm:text-4xl">🪐</span>
                <span className="absolute bottom-10 right-8 md:right-16 animate-pulse text-yellow-400 text-2xl sm:text-3xl">♈</span>
                <span className="absolute top-20 right-4 md:right-8 animate-spin text-blue-400 text-xl sm:text-2xl">☀</span>
            </div>

            <div className="bg-[#1e0836] p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg border border-purple-500 relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-4 sm:mb-6">Register</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "fullname", placeholder: "Full Name", icon: "👤", type: "text" },
                        { name: "email", placeholder: "Email", icon: "📧", type: "email" },
                        { name: "phone", placeholder: "Phone Number", icon: "📞", type: "tel" },
                        { name: "username", placeholder: "Username", icon: "🔹", type: "text" },
                        { name: "password", placeholder: "Password", icon: "🔑", type: "password" },
                    ].map(({ name, placeholder, icon, type }) => (
                        <div key={name} className="relative group">
                            <input
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#2a0c4e] border border-purple-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 pl-12 transition"
                                required
                            />
                            <span className="absolute left-3 top-3 text-yellow-400 group-focus-within:translate-x-1 transition">
                                {icon}
                            </span>
                        </div>
                    ))}

                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                        {["user", "admin", "astrologer"].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setFormData({ ...formData, role })}
                                className={`w-full sm:w-1/3 p-3 rounded-lg text-white font-bold border ${
                                    formData.role === role
                                        ? "bg-yellow-400 text-black border-yellow-500"
                                        : "bg-[#2a0c4e] border-purple-500 hover:bg-purple-600"
                                } transition`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-gradient-to-r from-purple-500 to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:from-yellow-400 hover:to-purple-500 transition relative disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? <span className="animate-pulse">Registering...</span> : "Register"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="text-blue-400 cursor-pointer hover:underline">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
