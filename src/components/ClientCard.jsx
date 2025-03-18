import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ClientCard = ({ client }) => {
    if (!client) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-lg p-4 w-64 flex-shrink-0"
        >
            <img
                src={client.profilePicture || "https://via.placeholder.com/150"}
                alt={client.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold">{client.fullname}</h3>
            <p className="text-gray-600">Recent Booking: {client.lastBooking || "N/A"}</p>
            <Link to={`/booking/${client.id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                View Profile
            </Link>
        </motion.div>
    );
};

export default ClientCard;
