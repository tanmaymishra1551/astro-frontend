import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const useSocket = (astrologerId) => {
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const loggedIn = useSelector((state) => state.auth);
    const loggedInToken = loggedIn.loggedIn.accessToken;
    const loggedInUserRole = loggedIn.loggedIn.role;

    useEffect(() => {
        if (!astrologerId || !loggedInToken) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: "/ws/chat",
            auth: { loggedInToken },
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => console.log("Connected to WebSocket from user side useSocket"));
        socket.on("connect_error", (err) => console.error("WebSocket connection error:", err));

        socket.on("receiveMessage", (messageData) => {
            console.log("Real-time message received:", messageData)

            // 1. Add to messages list
            setMessages(messageData)
        })



        if (loggedInUserRole !== "astrologer") {
            console.log(`astrologer status update for user ${astrologerId}`)
            socket.on("astrologer-status-update", ({ id, username, status }) => {
                // console.log(`Astrologer ${username} (ID: ${id}) is now ${status}`);
                // Update astrologer's status in the UI
                // updateAstrologerStatus(id, status); // Custom function for UI update
            });
        }

        if (loggedInUserRole == "astrologer") {
            socket.emit("toggle-online-visibility", { id: astrologerId, showOnline: true });
        }

        socket.emit("joinAstrologer", { astrologerId, isAstrologer: true });
        socket.emit("getUnreadMessages", { astrologerId });

        socket.on("loadUnreadMessages", (data) => {
            setUnreadMessages(data);
            if (data.length > 0) toast.info(`You have ${data.length} unread messages`);
        });

        socket.on("newMessageNotification", (data) => {
            toast.info(`New message from User ${data.senderId}`);
            setUnreadMessages((prev) => [...prev, data]);
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [astrologerId, loggedInToken]);

    return { messages, unreadMessages, socket: socketRef.current };
};