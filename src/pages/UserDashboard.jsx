import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const UserDashboard = () => {
    const user = useSelector((state) => state.auth);
    const userName = user?.loggedIn?.username || "User";
    const [astrologers, setAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchAstrologers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/astrologer`);
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

    // Responsive Breakpoints
    const getSlideSize = () => {
        if (window.innerWidth >= 1024) return 3; // Large screens: 3 cards per slide
        if (window.innerWidth >= 768) return 2; // Medium screens: 2 cards per slide
        return 1; // Small screens: 1 card per slide
    };

    const [slideSize, setSlideSize] = useState(getSlideSize());

    useEffect(() => {
        const handleResize = () => setSlideSize(getSlideSize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalSlides = Math.ceil(astrologers.length / slideSize);

    // Next & Prev Handlers
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0132] to-[#090114] text-white p-6">
            {/* Dashboard Header */}
            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
                {userName}'s Dashboard
            </h2>

            {/* Loading and Error Handling */}
            {loading ? (
                <div className="text-center text-gray-300">Loading astrologers...</div>
            ) : error ? (
                <div className="text-center text-red-400">
                    Error: {error}
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 px-4 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                    >
                        Retry
                    </button>
                </div>
            ) : astrologers.length === 0 ? (
                <p className="text-center text-gray-300">No astrologers available.</p>
            ) : (
                <div className="relative max-w-5xl mx-auto">
                    {/* Carousel Wrapper */}
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {astrologers
                                    .slice(currentSlide * slideSize, (currentSlide + 1) * slideSize)
                                    .map((ast) => (
                                        <motion.div
                                            key={ast.id}
                                            className="bg-[#1e0836] rounded-lg p-4 shadow-lg"
                                        >
                                            <img
                                                src={ast.profile_image || "/public/default-profile.png"}
                                                alt={ast.fullname}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <div className="mt-4 text-center">
                                                <h3 className="text-xl text-yellow-400 font-semibold">{ast.fullname}</h3>
                                                <p className="text-sm text-gray-400">{ast.specialty || "Specialty not available"}</p>
                                                <Link
                                                    to={`/booking/${ast.id}`}
                                                    className="mt-4 inline-block bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                                                >
                                                    Book a session
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons for Large Screens */}
                    {astrologers.length > slideSize && (
                        <div className="hidden lg:flex justify-between absolute top-1/2 w-full -translate-y-1/2 px-4">
                            <button
                                onClick={prevSlide}
                                className="text-yellow-400 text-2xl bg-[#1e0836] p-2 rounded-full"
                            >
                                ◀
                            </button>
                            <button
                                onClick={nextSlide}
                                className="text-yellow-400 text-2xl bg-[#1e0836] p-2 rounded-full"
                            >
                                ▶
                            </button>
                        </div>
                    )}

                    {/* Pagination Indicators for Small Screens */}
                    <div className="flex justify-center mt-4 lg:hidden">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-3 w-3 mx-1 rounded-full ${
                                    index === currentSlide ? "bg-yellow-500" : "bg-gray-500"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
