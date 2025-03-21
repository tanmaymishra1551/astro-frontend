import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserStatusToggle from "../../components/UserStatusToggle.jsx";
import DeleteUserButton from "../../components/DeleteUserButton.jsx";
import ResetPasswordButton from "../../components/ResetPasswordButton.jsx";
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const UserDetailPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user detail:", error);
        }
    };

    if (!user) {
        return <div className="p-6 text-yellow-400">Loading...</div>;
    }

    const isAstrologer = user.role === "astrologer";

    return (
        <div className="p-6">
            <Link to="/admin/users" className="text-yellow-400 hover:underline">
                ← Back to User List
            </Link>
            <div className="max-w-3xl mx-auto bg-[#1e0138] text-yellow-400 p-6 rounded-lg shadow-lg mt-6">
                <h1 className="text-3xl font-bold text-center mb-6">User Details</h1>

                <div className="space-y-4">
                    <div><strong>Full Name:</strong> {user.data.fullname}</div>
                    <div><strong>Email:</strong> {user.data.email}</div>
                    <div><strong>Phone:</strong> {user.data.phone || "N/A"}</div>
                    <div><strong>Role:</strong> {user.data.role}</div>
                    <div><strong>Status:</strong> <UserStatusToggle userId={user.data.id} currentStatus={user.data.status} /></div>

                    {isAstrologer && (
                        <>
                            <div><strong>Specialization:</strong> {user.data.specialization || "N/A"}</div>
                            <div><strong>Experience:</strong> {user.data.experience || "N/A"} years</div>
                            <div><strong>Availability:</strong> {user.data.availability || "N/A"}</div>
                            <div><strong>Pricing:</strong> ${user.data.pricing || "N/A"}</div>
                            {user.data.profilePicture && (
                                <div className="mt-4 flex justify-center">
                                    <img src={user.data.profilePicture} alt="Profile" className="w-32 h-32 rounded-full border-2 border-yellow-400" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                    <DeleteUserButton userId={user.data.id} />
                    <ResetPasswordButton userId={user.data.id} />
                </div>

                {/* Activity Logs */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Activity Logs</h2>
                    {user.activityLogs && user.activityLogs.length > 0 ? (
                        <ul className="list-disc ml-6 text-sm">
                            {user.activityLogs.map((log, index) => (
                                <li key={index} className="mt-2">
                                    {log.timestamp}: {log.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm mt-2">No activity logs available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
