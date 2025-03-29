import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const useChat = (roomId, currentUser, receiverId) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();
    const token = useSelector((state) => state.auth.token);
    // console.log(`${token}`)

    useEffect(() => {
        // console.log(`Room id is ${roomId}`)
        if (!roomId) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: '/ws/chat',
            auth: { token },
            transports: ['websocket']
        });

        socketRef.current.on("connect", () => console.log("Connected to WebSocket"));
        socketRef.current.on("connect_error", (err) => console.error("WebSocket connection error:", err));
        socketRef.current.emit('joinRoom', { roomId });

        socketRef.current.on('receiveMessage', (data) => {
            // console.log(`Client user id is ${JOSN.stringify(currentUser)} and server user id is ${data.senderId}`)
            if (data.senderId !== currentUser.id) toast.info('New message received');
            setMessages((prev) => [...prev, data]);
        });

        return () => socketRef.current.disconnect();
    }, [roomId, currentUser]);

    const sendMessage = (message) => {
        if (!message.trim()) return;
        const messageData = {
            roomId,
            senderId: currentUser.user.id,
            receiverId,
            message,
            timestamp: Date.now(),
        };
        socketRef.current.emit('sendMessage', messageData);
    };

    return { messages, sendMessage };
};

export default useChat;
