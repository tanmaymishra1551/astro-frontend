import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const ProfilePage = ({ setViewProfile }) => {
    const { astrologer } = useSelector((state) => state.auth);

    return (
        <div className="bg-[#1e0138] text-yellow-400 min-h-[80vh] p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
                <FaUserCircle className="text-6xl mb-4" />
                <h2 className="text-3xl font-semibold">{astrologer.fullname}</h2>
                <p className="text-gray-300 mt-2">{astrologer.email}</p>
                <p className="text-gray-400">Phone: {astrologer.phone || "N/A"}</p>
            </div>

            <div className="mt-6 space-y-4">
                <div className="bg-[#32014a] p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold">Experience</h3>
                    <p className="text-gray-300">{astrologer.experience || "Not provided"}</p>
                </div>

                <div className="bg-[#32014a] p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold">Specialties</h3>
                    <p className="text-gray-300">{astrologer.specialties || "Not provided"}</p>
                </div>

                <div className="bg-[#32014a] p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold">Languages</h3>
                    <p className="text-gray-300">{astrologer.languages || "Not provided"}</p>
                </div>
            </div>

            <button
                onClick={() => setViewProfile(false)}
                className="mt-6 bg-yellow-500 text-[#1e0138] px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default ProfilePage;
