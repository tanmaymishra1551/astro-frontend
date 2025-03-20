import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;
console.log (`API_BASE_URL is ${API_BASE_URL}`)
const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [astrologers, setAstrologers] = useState([]);
    const [index, setIndex] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAstrologers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/astrologer`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setAstrologers(data?.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAstrologers();
    }, []);

    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % astrologers.length);
    };

    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + astrologers.length) % astrologers.length);
    };

    const visibleastrologers = astrologers.length >= 3 
    ? [astrologers[index], astrologers[(index + 1) % astrologers.length], astrologers[(index + 2) % astrologers.length]]
    : astrologers;


    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">{user?.username}'s Dashboard</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : astrologers.length > 0 ? (
                <div className="relative flex items-center justify-center">
                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full"
                    >
                        <ChevronLeft size={30} />
                    </button>

                    {/* Cards Container */}
                    <div className="flex gap-6 overflow-hidden w-full justify-center">
                        {visibleastrologers.map((ast, idx) =>
                            ast ? (
                                <motion.div
                                    key={ast.id}
                                    initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white shadow-lg rounded-lg p-4 w-64 flex-shrink-0"
                                >
                                    <img
                                        src={ast.profilePicture || "https://via.placeholder.com/150"}
                                        alt={ast.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-semibold">{ast.fullname}</h3>
                                    <p className="text-gray-600">{ast.specialty || "Specialty not provided"}</p>
                                    <Link
                                        to={`/booking/${ast.id}`}
                                        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                                    >
                                        Book a session
                                    </Link>
                                </motion.div>
                            ) : null
                        )}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full"
                    >
                        <ChevronRight size={30} />
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">No astrologers found.</p>
            )}
        </div>
    );
};

export default UserDashboard;
