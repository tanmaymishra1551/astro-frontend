import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const useChat = (roomId, currentUser, receiverId) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        if (!roomId) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: '/ws/chat',
            query: { token: localStorage.getItem('token') },
        });

        socketRef.current.emit('joinRoom', { roomId });

        socketRef.current.on('receiveMessage', (data) => {
            if (data.senderId !== currentUser.id) toast.info('New message received');
            setMessages((prev) => [...prev, data]);
        });

        return () => socketRef.current.disconnect();
    }, [roomId, currentUser]);

    const sendMessage = (message) => {
        if (!message.trim()) return;
        const messageData = {
            roomId,
            senderId: currentUser.id,
            receiverId,
            message,
            timestamp: Date.now(),
        };
        socketRef.current.emit('sendMessage', messageData);
    };

    return { messages, sendMessage };
};

export default useChat;
