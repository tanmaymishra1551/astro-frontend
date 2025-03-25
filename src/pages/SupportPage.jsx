import React, { useState } from "react";
import { FaBell} from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [faq] = useState([
        { question: "How do I book an astrologer?", answer: "Go to the astrologer list, select one, and choose 'Chat' or 'Video Call'." },
        { question: "What payment methods are accepted?", answer: "We accept credit/debit cards, UPI, and net banking." },
        { question: "Can I get a refund?", answer: "Refunds are processed within 5-7 business days for valid cases." }
    ]);

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        if (!email || !message) return;

        const newTicket = { email, message, status: "Pending" };
        setTickets((prev) => [...prev, newTicket]);

        setEmail("");
        setMessage("");
    };

    return (
        <>
            {/* Header */}
            <header className="bg-[#1e0138] shadow-md p-4 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-bold text-yellow-400">We are happy to help you</h2>
                <div className="flex items-center gap-4">
                    <FaBell className="text-xl md:text-2xl text-yellow-400 cursor-pointer hover:text-purple-400 transition" />
                    <Link
                        to="/support"
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm md:text-base hover:bg-purple-500 transition"
                    >
                        Support
                    </Link>
                    <ProfileDropdown />
                </div>
            </header>
            <div className="min-h-screen bg-gradient-to-b from-[#1a0132] to-[#090114] text-white p-6">
                <h2 className="text-2xl font-bold text-yellow-400 text-center">Support Center</h2>

                {/* Email Support Form */}
                <div className="bg-[#2a0c4e] p-4 rounded-lg mt-6 shadow-lg border border-yellow-400 max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-yellow-400">Submit a Support Ticket</h3>

                    <form onSubmit={handleSubmitTicket} className="mt-4">
                        <label className="block text-sm text-gray-300">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-[#3a0f5a] text-white border border-purple-500" placeholder="Enter your email" required />

                        <label className="block text-sm text-gray-300 mt-2">Message</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 rounded bg-[#3a0f5a] text-white border border-purple-500" placeholder="Describe your issue" rows="3" required></textarea>

                        <button type="submit" className="mt-3 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition w-full">
                            Submit Ticket
                        </button>
                    </form>
                </div>

                {/* Ticket Tracking */}
                <div className="bg-[#2a0c4e] p-4 rounded-lg mt-6 shadow-lg border border-yellow-400 max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-yellow-400">Track Your Tickets</h3>
                    <ul className="mt-2 space-y-2">
                        {tickets.length > 0 ? (
                            tickets.map((ticket, idx) => (
                                <li key={idx} className="text-sm text-gray-300 bg-[#3a0f5a] p-2 rounded-lg">
                                    {ticket.message} - <span className="text-yellow-400">{ticket.status}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400">No tickets submitted yet.</p>
                        )}
                    </ul>
                </div>

                {/* FAQs */}
                <div className="bg-[#2a0c4e] p-4 rounded-lg mt-6 shadow-lg border border-yellow-400 max-w-3xl mx-auto">
                    <h3 className="text-lg font-semibold text-yellow-400">Common Queries</h3>
                    <ul className="mt-2 space-y-2">
                        {faq.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-300 bg-[#3a0f5a] p-2 rounded-lg">
                                <strong>{item.question}</strong>: {item.answer}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SupportPage;
