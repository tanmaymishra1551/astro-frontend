import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ClientCard = ({ client }) => {
    if (!client) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#1e0138] shadow-lg rounded-lg p-4 w-64 flex-shrink-0 text-yellow-400 border border-yellow-400"
        >
            <img
                src={client.profilePicture || "https://via.placeholder.com/150"}
                alt={client.name}
                className="w-full h-40 object-cover rounded-lg mb-4 border border-yellow-400"
            />
            <h3 className="text-lg font-semibold">{client.fullname}</h3>
            <p className="text-gray-300 text-sm">Recent Booking: {client.lastBooking || "N/A"}</p>
            <Link 
                to={`/booking/${client.id}`} 
                className="mt-4 inline-block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:opacity-80 transition"
            >
                View Profile
            </Link>
        </motion.div>
    );
};

export default ClientCard;
