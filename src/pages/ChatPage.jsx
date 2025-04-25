import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaBell } from "react-icons/fa";
import useFileUpload from '../hooks/useFileUpload.jsx';
import { useLocation } from "react-router-dom";

// Custom Hook for WebSocket Chat
const useChat = (roomId, senderID, receiverID) => {
    // const location = useLocation();
    // const astrologerId = location.state?.astrologerId;
    // const senderId = location.state?.senderId;
    // console.log(`From astrologer side senderId is ${senderId}`)
    // console.log(`Getting astrologer id from booking page is ${astrologerId}`)
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();
    const loggedIn = useSelector((state) => state.auth);
    const loggedInToken = loggedIn.loggedIn.accessToken;
    const loggedInFullname = loggedIn.loggedIn.fullname;
    // console.log(`Logged in user token ${loggedInToken}`)
    useEffect(() => {
        if (!roomId) return;

        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: '/ws/chat',
            auth: { loggedInToken },
            transports: ['websocket']
        });

        socketRef.current.on("connect", () => console.log("Connected to WebSocket"));
        socketRef.current.on("connect_error", (err) => console.error("WebSocket connection error:", err));
        socketRef.current.emit('join-room', { roomId });

        // MESSAGE GETTING FROM SERVER
        socketRef.current.on('receiveMessage', (data) => {
            console.log(`Receive message is  ${JSON.stringify(data)}`);
            if (data.senderId !== senderID) {
                toast.info('New message received');
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => socketRef.current.disconnect();
    }, [roomId, senderID]);

    const sendMessage = (message) => {
        if (!message.trim()) return;
        // console.log(`Message in sendMessage is ${message}`)
        const messageData = {
            roomId,
            message,
            senderID,
            loggedInFullname,
            receiverID,
            timestamp: Date.now(),
        };
        // console.log(`Message that is send to server is ${JSON.stringify(messageData)}`)
        socketRef.current.emit('sendMessage', messageData);
    };


    return { messages, sendMessage };
};

// Chat Page Component
const ChatPage = () => {
    const location = useLocation();
    const astrologerIdFromBooking = location.state?.astrologerId; // role: user
    const astrologerIdFromAstDash = location.state?.senderId;                    // role:astrologer
    const [input, setInput] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { id } = useParams();
    const chatRoomId = id;
    const loggedIn = useSelector((state) => state.auth);
    const loggedInPersonRole = loggedIn.loggedIn.role;
    const loggedInPersonId = loggedIn.loggedIn.id;

    const senderID = loggedInPersonId;
    const receiverID = loggedInPersonRole == "user" ? astrologerIdFromBooking : astrologerIdFromAstDash

    // console.log(`🚀 Sender ID: ${senderID}, Receiver ID: ${receiverID}`);

    // Use Chat Hook
    const { messages, sendMessage } = useChat(chatRoomId, senderID, receiverID);
    // console.log(`Message is ${JSON.stringify(messages)}`)
    // File Upload Hook
    const { selectedFile, previewUrl, handleFileChange, uploadFile } = useFileUpload();

    return (
        <>
            {/* Header */}
            <header className="bg-[#1e0138] shadow p-4 flex justify-between items-center">
                <div className="text-lg font-semibold text-yellow-400">Welcome</div>

                <div className="flex items-center gap-4">
                    <FaBell className="text-2xl text-yellow-400 cursor-pointer hover:text-yellow-300" />
                    <div className="relative">
                        <FaUserCircle
                            className="text-3xl text-yellow-400 cursor-pointer hover:text-yellow-300"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#2c024b] text-yellow-400 rounded-lg shadow-lg">
                                <button className="block px-4 py-2 hover:bg-[#3a035f] w-full text-left">Profile</button>
                                <button className="block px-4 py-2 hover:bg-[#3a035f] w-full text-left">Notifications</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-[#3a035f]">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Chat Section */}
            <div className="p-4 border rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Chat with Astrologer (User: {receiverID})</h2>

                {/* Messages */}
                <div className="h-64 border p-2 mb-4 overflow-y-auto">
                    {messages.length === 0 && <p className="text-gray-500">No messages yet. Start the conversation!</p>}
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">{msg.senderID}</span> at{" "}
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                            {msg.message && <p>{msg.message}</p>}
                            {msg.fileUrl && (
                                <div className="mt-2">
                                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        View File
                                    </a>
                                    <img src={msg.fileUrl} alt="Uploaded file" className="max-w-xs mt-2 border rounded" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input and File Upload */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage(input);
                        setInput('');
                    }}
                    className="flex flex-col space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <input type="file" onChange={handleFileChange} className="block" />
                        {previewUrl && <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover border rounded" />}
                        <button type="button" onClick={() => uploadFile(roomId, currentUser.id, sendMessage)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                            Upload File
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatPage;
