// UnreadMessagesTable.js
import React from "react";

const UnreadMessagesTable = ({ messages, onMarkAsRead }) => {
    if (!messages || messages.length === 0) return null;

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Unread Messages</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 border">Sender</th>
                            <th className="p-3 border">Message</th>
                            <th className="p-3 border">Time</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id} className="text-center border-b">
                                <td className="p-3 border">{msg.senderName || "Unknown"}</td>
                                <td className="p-3 border">
                                    {msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}
                                </td>
                                <td className="p-3 border">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-3 border">
                                    <button
                                        onClick={() => onMarkAsRead(msg.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                    >
                                        Mark as Read
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UnreadMessagesTable;
