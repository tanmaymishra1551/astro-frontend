import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { useClients } from "../hooks/useClients.jsx";
import ClientCard from "../components/ClientCard.jsx";
import Profile from "./ProfilePage.jsx";
import { formatToUserLocalTime } from '../util/dateFormatter.js';


const AstrologerDashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [viewProfile, setViewProfile] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const socketRef = useRef(null);

    const astrologer = useSelector((state) => state.auth);
    const { clients, loading, error } = useClients();
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const loggedInToken = astrologer?.loggedIn?.accessToken;
    const astrologerId = astrologer?.loggedIn?.id;

    // WebSocket setup
    useEffect(() => {
        if (!astrologerId || !loggedInToken) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: "/ws/chat",
            auth: { loggedInToken },
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("✅ Connected to WebSocket");
            socket.emit("toggle-online-visibility", { id: astrologerId, showOnline: true });
            socket.emit("joinAstrologer", { astrologerId, isAstrologer: true });
            socket.emit("joinRoom", { roomId: astrologerId }); // 👈 listen for personal msgs
            socket.emit("getUnreadMessages", { astrologerId });
        });

        socket.on("connect_error", (err) => console.error("❌ WebSocket error:", err));

        socket.on("receiveMessage", (message) => {
            console.log("📩 receiveMessage", message);
            toast.success("New message received");
            setUnreadMessages((prev) => [...prev, message]);
        });

        socket.on("newMessage", (data) => {
            // console.log("🔔 newMessageNotification", data);
            toast(`New message from ${data.from}`);
            setUnreadMessages((prev) => [...prev, data]);
        });

        socket.on("loadUnreadMessages", (data) => {
            // console.log("📥 loadUnreadMessages", data);
            setUnreadMessages(data);
            if (data.length > 0) {
                toast.custom(
                    <div className="bg-[#1e0138] text-white px-4 py-3 rounded shadow-md border border-yellow-500">
                        📩 You have {data.length} unread message{data.length > 1 ? 's' : ''}
                    </div>,
                    { duration: 2000 }
                );
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [astrologerId, loggedInToken]);

    const socket = socketRef.current;

    const handleReply = (message) => {
        // console.log(`Message is ${message}`)
        const senderId = message.senderId;
        if (socket && message.roomId) {
            socket.emit("joinRoom", { roomId: message.roomId });
            navigate(`/chat/${message.roomId}`, { state: { senderId } });
            setIsNotificationOpen(false);
        }
    };

    const handleMarkAsRead = (messageId) => {
        setUnreadMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        socket.emit("markAsRead", { messageId });
    };

    const nextSlide = () => setIndex((prev) => (prev + 1) % clients.length);
    const prevSlide = () => setIndex((prev - 1 + clients.length) % clients.length);

    const visibleClients = clients.length >= 3
        ? [clients[index], clients[(index + 1) % clients.length], clients[(index + 2) % clients.length]]
        : clients;

    useEffect(() => {
        if (!socketRef.current) return;

        // Listen for incoming video call requests
        socketRef.current.on("video-call-request", (data) => {
            console.log("Incoming video call:", data);
            // Show a toast/notification with a button for the astrologer to join
            toast.custom(
                <div className="bg-[#1e0138] text-white px-4 py-3 rounded shadow-md border border-yellow-500">
                    <div>Incoming video call from User {data.from}</div>
                    <button
                        className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded"
                        onClick={() => {
                            // Navigate to VideoPage as callee with room id and recipient id (which will be user id)
                            navigate(`/video?roomId=${data.roomId}&recipientId=${data.from}&role=callee`);
                        }}
                    >
                        Join Call
                    </button>
                </div>,
                { duration: 10000 }
            );
        });
    }, [socketRef.current, navigate]);



    return (
        <div className="astro-bg min-h-screen">
            {/* Header */}
            <header className="bg-[#1e0138] shadow p-4 flex justify-between items-center relative">
                <div className="text-lg font-semibold text-yellow-400">
                    Welcome {astrologer.loggedIn.fullname}
                </div>

                <div className="flex items-center gap-4">
                    <FaBell
                        className="text-2xl text-yellow-400 cursor-pointer"
                        onClick={() => setIsNotificationOpen(true)}
                    />

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
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Profile or Dashboard */}
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
                                        <ClientCard key={client?.id || `client-${idx}`} client={client} />

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

            {/* Notifications */}
            {isNotificationOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-[1px] flex justify-center md:justify-end"
                    onClick={() => setIsNotificationOpen(false)}
                >
                    <div
                        className="h-screen w-[90%] md:w-80 max-w-lg bg-[#1e0138] shadow-lg p-4 rounded-lg text-white md:mr-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b border-gray-500 pb-2">
                            <h3 className="text-lg font-semibold text-yellow-400">Notifications</h3>
                            <X className="cursor-pointer text-gray-300 hover:text-white" onClick={() => setIsNotificationOpen(false)} />
                        </div>

                        <div className="mt-3 pb-10 space-y-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                            {unreadMessages.length > 0 ? (
                                unreadMessages.map((msg) => (
                                    <div key={msg._id} className="bg-[#2c024b] p-3 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-yellow-400 font-medium">{msg.fullname}</p>
                                                <p className="text-sm text-gray-300">{msg.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{formatToUserLocalTime(msg.timestamp)}</span>
                                        </div>
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
