import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Layout = ({ children }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth.accessToken);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                dispatch(clearAuthToken()); // Clear Redux store
                navigate("/"); // Redirect to login page
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-b from-[#1a0132] to-[#090114] text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e0138] text-white flex flex-col shadow-lg">
                <div className="p-4 text-lg font-bold border-b border-[#2c024b] text-yellow-400">
                    Dashboard
                </div>
                <nav className="flex-1">
                    <ul>
                        <li className="px-4 py-3 hover:bg-[#2c024b] cursor-pointer">
                            <Link to="/dashboard" className="text-yellow-400">Dashboard</Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-[#2c024b] cursor-pointer">
                            <Link to="/admin/users" className="text-yellow-400">Astrologers</Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-[#2c024b] cursor-pointer">
                            <Link to="" className="text-yellow-400">Users</Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-[#2c024b]">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-[#1e0138] shadow p-4 flex justify-between items-center relative">
                    <div className="text-lg font-semibold text-yellow-400">
                        Welcome to Dashboard
                    </div>
                    
                    {/* Profile Section */}
                    <div className="relative">
                        <FaUserCircle
                            className="text-3xl text-yellow-400 cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                                <Link 
                                    to="" 
                                    className="block px-4 py-2 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link 
                                    to="" 
                                    className="block px-4 py-2 hover:bg-gray-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Notifications
                                </Link>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Section */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
