import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#1a0132] to-[#090114] text-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 sm:px-8 py-4 md:py-6">
                <div className="text-yellow-400 text-2xl font-bold">ASTROLOGY</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                    {["Home", "About", "Service", "Blog", "Contact"].map((item) => (
                        <a key={item} href="#" className="hover:text-yellow-400 transition">{item}</a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-yellow-400 text-2xl"
                >
                    ☰
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center bg-[#1e0836] py-4 space-y-2">
                    {["Home", "About", "Service", "Blog", "Contact"].map((item) => (
                        <a key={item} href="#" className="hover:text-yellow-400">{item}</a>
                    ))}
                </div>
            )}

            {/* Astrology Wheel & Content */}
            <div className="flex flex-col items-center text-center px-4 py-12 sm:py-16 mb-3">
                {/* Astrology Wheel */}
                <div className="relative w-60 sm:w-72 md:w-96">
                    <img src="/th.jpg" alt="Astrology Wheel" className="w-full h-full" />
                </div>

                {/* Heading & Text */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6">
                    World Famous Astrology Expert
                </h1>
                <p className="mt-4 text-gray-300 max-w-md sm:max-w-xl">
                    Unlock the secrets of the stars with our expert astrology guidance. 
                    Discover your fate and align your life with the universe.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate("/register")}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
