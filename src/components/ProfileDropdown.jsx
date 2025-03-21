import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaWallet, FaEdit, FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const { user } = useSelector((state) => state.auth);

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
        <div className="relative">
            {/* Profile Icon */}
            <FaUserCircle
                className="text-3xl text-yellow-400 cursor-pointer hover:text-purple-400 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded-lg shadow-lg p-4">
                    {/* Profile Summary */}
                    <div className="flex items-center gap-3 border-b pb-3">
                        <img
                            src={user?.profilePicture || "https://via.placeholder.com/50"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-yellow-400"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{user?.username}</h3>
                            <p className="text-sm text-gray-500">Loyalty Points: <span className="text-yellow-500">{user?.loyaltyPoints || 0}</span></p>
                            <p className="text-sm text-gray-500">Wallet Balance: <span className="text-green-500">₹{user?.walletBalance || 0}</span></p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-3">
                        <Link
                            to="/profile/edit"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaEdit className="text-gray-600" /> Edit Profile
                        </Link>
                        <Link
                            to="/wallet/recharge"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaMoneyBillWave className="text-green-500" /> Recharge Wallet
                        </Link>
                        <Link
                            to="/wallet/transactions"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded transition"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaWallet className="text-blue-500" /> View Transactions
                        </Link>
                        <button
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-200 rounded transition text-red-500"
                            onClick={() => {
                                setDropdownOpen(false);
                                handleLogout();
                            }}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
