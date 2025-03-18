const UnreadMessageCard = ({ message, handleReply }) => (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
        <p className="text-gray-800">{message.message}</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => handleReply(message)}>
            Reply
        </button>
    </div>
);

export default UnreadMessageCard;
