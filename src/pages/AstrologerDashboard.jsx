import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClients } from "../hooks/useClients.jsx";
import { useSocket } from "../hooks/useSocket.jsx";
import ClientCard from "../components/ClientCard.jsx";
import UnreadMessageCard from "../components/UnreadMessageCard.jsx";

const AstrologerDashboard = () => {
    const { astrologer } = useSelector((state) => state.auth);
    const { clients, loading, error } = useClients();
    const { unreadMessages, socketRef } = useSocket(astrologer.id);
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const handleReply = (message) => {
        if (socketRef.current && message.roomId) {
            socketRef.current.emit("joinRoom", { roomId: message.roomId });
            navigate(`/chat/${message.roomId}`);
        }
    };

    const nextSlide = () => setIndex((prev) => (prev + 1) % clients.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + clients.length) % clients.length);

    const visibleClients = clients.length >= 3
        ? [clients[index], clients[(index + 1) % clients.length], clients[(index + 2) % clients.length]]
        : clients;


    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-2 text-center">
                Welcome, {astrologer.username}
            </h2>

            {/* Unread Messages */}
            {unreadMessages.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Unread Messages</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {unreadMessages.map((msg) => (
                            <UnreadMessageCard key={msg._id} message={msg} handleReply={handleReply} />
                        ))}
                    </div>
                </div>
            )}

            <p className="text-center text-gray-600 mb-4">Your latest clients and bookings</p>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : clients.length > 0 ? (
                <div className="relative flex items-center justify-center">
                    <button onClick={prevSlide} className="absolute left-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full">
                        <ChevronLeft size={30} />
                    </button>
                    <div className="flex gap-6 overflow-hidden w-full justify-center">
                        {visibleClients.map((client, idx) => (
                            <ClientCard key={`${client?.id}-${idx}`} client={client} />
                        ))}

                    </div>
                    <button onClick={nextSlide} className="absolute right-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full">
                        <ChevronRight size={30} />
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">No clients found.</p>
            )}
        </div>
    );
};

export default AstrologerDashboard;
