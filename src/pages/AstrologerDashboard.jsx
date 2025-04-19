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

const AstrologerDashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [viewProfile, setViewProfile] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Refs at component level
    const socketRef = useRef(null);
    const peerConnection = useRef(null);
    const localStream = useRef(null);

    const astrologer = useSelector((state) => state.auth);
    const { clients, loading, error } = useClients();
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const loggedInToken = astrologer?.loggedIn?.accessToken;
    const astrologerId = astrologer?.loggedIn?.id;

    // WebSocket setup
    useEffect(() => {
        if (!astrologerId || !loggedInToken) return;

        const setupSocket = () => {
            try {
                socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
                    path: "/ws/chat",
                    auth: { loggedInToken },
                    transports: ["websocket"],
                });

                const socket = socketRef.current;

                socket.on("connect", () => {
                    console.log("✅ Connected to WebSocket");
                    setIsConnected(true);
                    socket.emit("toggle-online-visibility", { id: astrologerId, showOnline: true });
                    socket.emit("joinAstrologer", { astrologerId, isAstrologer: true });
                    socket.emit("joinRoom", { roomId: astrologerId });
                    socket.emit("getUnreadMessages", { astrologerId });
                });

                socket.on("connect_error", (err) => {
                    console.error("❌ WebSocket error:", err);
                    setIsConnected(false);
                });

                socket.on("disconnect", () => {
                    console.log("❌ Disconnected from WebSocket");
                    setIsConnected(false);
                });

                // Listen for incoming video call requests
                socket.on("video-call-request", ({ roomId, from, username }) => {
                    console.log(`Astorloger got video call requst form ${from} and ask to join room ${roomId}`)
                    toast.custom(
                        <div className="bg-[#1e0138] text-white px-4 py-3 rounded shadow-md border border-yellow-500">
                            <div>Incoming video call from User {username}</div>
                            <button
                                className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded"
                                onClick={() => {
                                    navigate(`/callee-video?roomId=${roomId}&callerId=${from}`);
                                }}
                            >
                                Join Call
                            </button>
                        </div>,
                        { duration: 10000 }
                    );
                });

                // Handle offer from caller
                socket.on("offer", async ({ offer, candidate, from }) => {
                    try {
                        console.log("Received offer from:", from);
                        
                        // Initialize peer connection if it doesn't exist
                        if (!peerConnection.current) {
                            peerConnection.current = new RTCPeerConnection({
                                iceServers: [
                                    { urls: 'stun:stun.l.google.com:19302' },
                                    { urls: 'stun:stun1.l.google.com:19302' }
                                ]
                            });

                            // Add local tracks if we have a local stream
                            if (localStream.current) {
                                localStream.current.getTracks().forEach(track => {
                                    peerConnection.current.addTrack(track, localStream.current);
                                });
                            }

                            // Handle ICE candidates
                            peerConnection.current.onicecandidate = (event) => {
                                if (event.candidate) {
                                    console.log('New ICE candidate:', event.candidate);
                                    socket.emit("ice-candidate", {
                                        candidate: event.candidate,
                                        to: from
                                    });
                                }
                            };

                            // Handle remote tracks
                            peerConnection.current.ontrack = (event) => {
                                const remoteStream = event.streams[0];
                                console.log('Remote track received:', event.track.kind);
                            };
                        }

                        // Set remote description
                        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                        console.log("Remote description set");

                        // Add any received ICE candidates
                        if (candidate) {
                            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                            console.log("Initial ICE candidate added");
                        }

                        // Create and set local description
                        const answer = await peerConnection.current.createAnswer();
                        await peerConnection.current.setLocalDescription(answer);
                        console.log("Local description set");

                        // Send answer to caller
                        socket.emit("answer", { answer, to: from });
                        console.log("Answer sent to caller");

                        // Navigate to video page
                        navigate("/video", { 
                            state: { 
                                roomId: from,
                                recipientId: from,
                                role: "callee"
                            }
                        });
                    } catch (error) {
                        console.error("Error handling offer:", error);
                        toast.error("Failed to handle video call offer");
                    }
                });

                // Handle ICE candidates from caller
                socket.on("ice-candidate", async ({ candidate }) => {
                    try {
                        if (candidate && peerConnection.current) {
                            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                            console.log("ICE candidate added");
                        }
                    } catch (error) {
                        console.error("Error adding ICE candidate:", error);
                    }
                });

                return () => {
                    if (socket) {
                        socket.disconnect();
                    }
                    if (peerConnection.current) {
                        peerConnection.current.close();
                    }
                    if (localStream.current) {
                        localStream.current.getTracks().forEach(track => track.stop());
                    }
                };
            } catch (error) {
                console.error("Error setting up socket:", error);
            }
        };

        setupSocket();
    }, [astrologerId, loggedInToken, navigate]);

    const handleReply = (message) => {
        const senderId = message.senderId;
        if (socketRef.current && message.roomId) {
            socketRef.current.emit("joinRoom", { roomId: message.roomId });
            navigate(`/chat/${message.roomId}`, { state: { senderId } });
            setIsNotificationOpen(false);
        }
    };

    const handleMarkAsRead = (messageId) => {
        setUnreadMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        // Optional: socket.emit("markAsRead", { messageId });
    };

    const nextSlide = () => setIndex((prev) => (prev + 1) % clients.length);
    const prevSlide = () => setIndex((prev - 1 + clients.length) % clients.length);

    const visibleClients = clients.length >= 3
        ? [clients[index], clients[(index + 1) % clients.length], clients[(index + 2) % clients.length]]
        : clients;

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
                                                <p className="text-yellow-400 font-medium">{msg.senderId}</p>
                                                <p className="text-sm text-gray-300">{msg.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{msg.timestamp}</span>
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
