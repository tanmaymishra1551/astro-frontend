// src/pages/UserDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserStatusToggle from '../../components/UserStatusToggle.jsx';
import DeleteUserButton from '../../components/DeleteUserButton.jsx';
import ResetPasswordButton from '../../components/ResetPasswordButton.jsx';

const UserDetailPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`/api/admin/users/${id}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user detail:', error);
        }
    };

    if (!user) {
        return <div className="p-4">Loading...</div>;
    }

    const isAstrologer = user.role === 'astrologer';

    return (
        <div className="p-4">
            <Link to="/admin/users" className="text-blue-500 mb-4 inline-block">
                Back to User List
            </Link>
            <h1 className="text-2xl font-bold mb-4">User Detail</h1>
            <div className="bg-white p-4 rounded shadow space-y-2">
                <div>
                    <strong>Full Name:</strong> {user.data.fullname}
                </div>
                <div>
                    <strong>Email:</strong> {user.data.email}
                </div>
                <div>
                    <strong>Phone:</strong> {user.data.phone}
                </div>
                <div>
                    <strong>Role:</strong> {user.data.role}
                </div>
                <div>
                    <strong>Status:</strong>{' '}
                    <UserStatusToggle userId={user.data.id} currentStatus={user.data.status} />
                </div>
                {isAstrologer && (
                    <>
                        <div>
                            <strong>Specialization:</strong> {user.data.specialization}
                        </div>
                        <div>
                            <strong>Experience:</strong> {user.data.experience} years
                        </div>
                        <div>
                            <strong>Availability:</strong> {user.data.availability}
                        </div>
                        <div>
                            <strong>Pricing:</strong> ${user.data.pricing}
                        </div>
                        {user.data.profilePicture && (
                            <div className="mt-2">
                                <img
                                    src={user.data.profilePicture}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="mt-4 flex space-x-4">
                <DeleteUserButton userId={user.data.id} />
                <ResetPasswordButton userId={user.data.id} />
            </div>
            {/* Optional Activity Logs */}
            <div className="mt-6">
                <h2 className="text-xl font-bold">Activity Logs</h2>
                {user.activityLogs && user.activityLogs.length > 0 ? (
                    <ul className="list-disc ml-6">
                        {user.activityLogs.map((log, index) => (
                            <li key={index}>
                                {log.timestamp}: {log.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>No activity logs available.</div>
                )}
            </div>
        </div>
    );
};

export default UserDetailPage;
