import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const useSocket = (astrologerId) => {
    const [unreadMessages, setUnreadMessages] = useState([]);
    const socketRef = useRef(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!astrologerId || !token) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: "/ws/chat",
            auth: { token },
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => console.log("Connected to WebSocket"));
        socket.on("connect_error", (err) => console.error("WebSocket connection error:", err));

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
    }, [astrologerId, token]);

    return { unreadMessages, socket: socketRef.current };
};
