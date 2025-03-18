import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat.jsx';
import useFileUpload from '../hooks/useFileUpload.jsx';

const ChatPage = () => {
    const { id } = useParams();
    const { user, astrologer } = useSelector((state) => state.auth);
    const currentUser = user || astrologer;

    const [input, setInput] = useState('');
    const [astrologerId, userId] = id.split('_').slice(1);
    const receiverId = currentUser.id === astrologerId ? userId : astrologerId;
    const roomId = id;

    const { messages, sendMessage } = useChat(roomId, currentUser, receiverId);
    const { selectedFile, previewUrl, handleFileChange, uploadFile } = useFileUpload();

    return (
        <div className="p-4 border rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Chat with Astrologer (User: {currentUser.id})</h2>

            {/* Chat Messages */}
            <div className="h-64 border p-2 mb-4 overflow-y-auto">
                {messages.length === 0 && <p className="text-gray-500">No messages yet. Start the conversation!</p>}
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">
                            <span className="font-bold">{msg.senderId}</span> at{" "}
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

            {/* Message Input and File Upload */}
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
    );
};

export default ChatPage;
