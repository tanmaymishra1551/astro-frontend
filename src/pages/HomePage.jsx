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

            {/* Services Section */}
            <div className="flex justify-center gap-4 sm:gap-6 lg:gap-12 mt-4">
                {/* Service 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/public/horoscope-993144_640.jpg"
                            alt="Service 1"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">Book Pooja</p>
                </div>

                {/* Service 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/public/tarot-991041_640.jpg"
                            alt="Service 2"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">Book Tarot Reading</p>
                </div>

                {/* Service 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/public/wedding-rituals-7472880_640.jpg"
                            alt="Service 3"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">Book Wedding Ritual</p>
                </div>

                {/* Service 4 */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/public/chat-2389223_640.png"
                            alt="Service 3"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">Book Chat Session</p>
                </div>

                {/* Service 5 */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/public/call.png"
                            alt="Service 3"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">Book Call Session</p>
                </div>
            </div>

            {/* Astrology Wheel & Content */}
            <div className="flex flex-col-reverse sm:flex-row items-center text-center sm:text-left px-4 py-12 sm:py-16 mb-3">
                {/* Heading & Text */}
                <div className="sm:w-1/2 text-center sm:text-left sm:ml-8 mt-6 sm:mt-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
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

                {/* Astrology Wheel Video */}
                <div className="relative sm:w-1/2 w-full sm:h-[400px] md:h-full h-[300px]">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                    >
                        <source src="/public/astoWheel.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>



            {/* Astrologer Cards Section */}
            <div className="text-center py-16">
                <h2 className="text-3xl text-yellow-400">Meet Our Astrologers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 px-4">
                    {/* Card 1 */}
                    <div className="bg-[#1e0836] rounded-lg p-4">
                        <img src="/public/asto1.png" alt="Astrologer 1" className="w-full h-40 object-cover rounded-lg" />
                        <div className="mt-4">
                            <h3 className="text-xl text-yellow-400">Astrologer Name</h3>
                            <p className="text-sm text-gray-400">Rating: ⭐⭐⭐⭐⭐</p>
                            <p className="mt-2 text-gray-300">Short description of the astrologer.</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#1e0836] rounded-lg p-4">
                        <img src="/public/asto2.jpg" alt="Astrologer 2" className="w-full h-40 object-cover rounded-lg" />
                        <div className="mt-4">
                            <h3 className="text-xl text-yellow-400">Astrologer Name</h3>
                            <p className="text-sm text-gray-400">Rating: ⭐⭐⭐⭐⭐</p>
                            <p className="mt-2 text-gray-300">Short description of the astrologer.</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#1e0836] rounded-lg p-4">
                        <img src="/public/asto3.jpg" alt="Astrologer 3" className="w-full h-40 object-cover rounded-lg" />
                        <div className="mt-4">
                            <h3 className="text-xl text-yellow-400">Astrologer Name</h3>
                            <p className="text-sm text-gray-400">Rating: ⭐⭐⭐⭐⭐</p>
                            <p className="mt-2 text-gray-300">Short description of the astrologer.</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[#1e0836] rounded-lg p-4">
                        <img src="/public/asto4.jpg" alt="Astrologer 4" className="w-full h-40 object-cover rounded-lg" />
                        <div className="mt-4">
                            <h3 className="text-xl text-yellow-400">Astrologer Name</h3>
                            <p className="text-sm text-gray-400">Rating: ⭐⭐⭐⭐⭐</p>
                            <p className="mt-2 text-gray-300">Short description of the astrologer.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default HomePage;
