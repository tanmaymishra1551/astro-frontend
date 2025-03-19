import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const useSocket = (astrologerId) => {
    const [unreadMessages, setUnreadMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!astrologerId) return;
        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: "/ws/chat",
            query: { token: localStorage.getItem("token") },
        });

        socketRef.current.emit("joinAstrologer", { astrologerId, isAstrologer: true });
        socketRef.current.emit("getUnreadMessages", { astrologerId });

        socketRef.current.on("loadUnreadMessages", (data) => {
            setUnreadMessages(data);
            if (data.length > 0) toast.info(`You have ${data.length} unread messages`);
        });

        socketRef.current.on("newMessageNotification", (data) => {
            toast.info(`New message from User ${data.senderId}`);
            setUnreadMessages((prev) => [...prev, data]);
        });

        return () => socketRef.current.disconnect();
    }, [astrologerId]);

    return { unreadMessages, socketRef };
};
