import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useClients } from "../hooks/useClients.jsx";
import { useSocket } from "../hooks/useSocket.jsx";
import ClientCard from "../components/ClientCard.jsx";
import { FaUserCircle, FaBell } from "react-icons/fa";
import Profile from "./ProfilePage.jsx";

const AstrologerDashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [viewProfile, setViewProfile] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    const { astrologer } = useSelector((state) => state.auth);
    const { clients, loading, error } = useClients();
    const { unreadMessages, socketRef, markAsRead } = useSocket(astrologer.id);
    
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    // Navigate to chat on clicking an unread message
    const handleReply = (message) => {
        if (socketRef.current && message.roomId) {
            socketRef.current.emit("joinRoom", { roomId: message.roomId });
            navigate(`/chat/${message.roomId}`);
            setIsNotificationOpen(false);
        }
    };

    // Mark message as read
    const handleMarkAsRead = (messageId) => {
        markAsRead(messageId); // Assuming markAsRead updates state
    };

    // Carousel Controls
    const nextSlide = () => setIndex((prev) => (prev + 1) % clients.length);
    const prevSlide = () => setIndex((prev - 1 + clients.length) % clients.length);

    // Display up to 3 clients in the carousel
    const visibleClients = clients.length >= 3
        ? [clients[index], clients[(index + 1) % clients.length], clients[(index + 2) % clients.length]]
        : clients;

    return (
        <div className="astro-bg min-h-screen">
            {/* Header */}
            <header className="bg-[#1e0138] shadow p-4 flex justify-between items-center relative">
                <div className="text-lg font-semibold text-yellow-400">
                    Welcome {astrologer.fullname}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <FaBell
                        className="text-2xl text-yellow-400 cursor-pointer"
                        onClick={() => setIsNotificationOpen(true)}
                    />

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <FaUserCircle
                            className="text-3xl text-yellow-400 cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                                <button
                                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                                    onClick={() => {
                                        setViewProfile(true);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                                    onClick={() => setIsNotificationOpen(true)}
                                >
                                    Notifications
                                </button>
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
                </div>
            </header>

            {/* Profile Page or Dashboard Content */}
            <div className="p-6">
                {viewProfile ? (
                    <Profile setViewProfile={setViewProfile} />
                ) : (
                    <>
                        <p className="text-center text-gray-600 mb-4">Your latest clients and bookings</p>

                        {loading ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">Error: {error}</p>
                        ) : clients.length > 0 && !isNotificationOpen ? (
                            <div className="relative flex items-center justify-center">
                                {clients.length > 1 && (
                                    <button onClick={prevSlide} className="absolute left-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full">
                                        <ChevronLeft size={30} />
                                    </button>
                                )}
                                
                                <div className="flex gap-6 overflow-hidden w-full justify-center">
                                    {visibleClients.map((client, idx) => (
                                        <ClientCard key={`${client?.id}-${idx}`} client={client} />
                                    ))}
                                </div>
                                
                                {clients.length > 1 && (
                                    <button onClick={nextSlide} className="absolute right-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full">
                                        <ChevronRight size={30} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No clients found.</p>
                        )}
                    </>
                )}
            </div>

            {/* Notification Sidebar */}
            {isNotificationOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-[1px] flex justify-center md:justify-end"
                    onClick={() => setIsNotificationOpen(false)}
                >
                    <div
                        className="h-screenw-[90%] md:w-80 max-w-lg bg-[#1e0138] shadow-lg p-4 rounded-lg text-white md:mr-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <div className="flex justify-between items-center border-b border-gray-500 pb-2">
                            <h3 className="text-lg font-semibold text-yellow-400">Notifications</h3>
                            <X
                                className="cursor-pointer text-gray-300 hover:text-white"
                                onClick={() => setIsNotificationOpen(false)}
                            />
                        </div>

                        {/* Unread Messages Inside Sidebar */}
                        <div className="mt-3 pb-10 space-y-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                            {unreadMessages.length > 0 ? (
                                unreadMessages.map((msg) => (
                                    <div key={msg._id} className="bg-[#2c024b] p-3 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-yellow-400 font-medium">{msg.senderId}</p>
                                                <p className="text-sm text-gray-300">{msg.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{msg.timestamp}</span>
                                        </div>
                                        {/* Buttons: Reply & Mark as Read */}
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
                                                onClick={() => handleReply(msg)}
                                            >
                                                Reply
                                            </button>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-white text-sm"
                                                onClick={() => handleMarkAsRead(msg._id)}
                                            >
                                                Mark as Read
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">No new messages</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AstrologerDashboard;
