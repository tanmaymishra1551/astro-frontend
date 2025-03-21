import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const [formData, setFormData] = useState({
        bookingId: "",
        amount: "",
        upiId: "",
    });
    const [paymentResponse, setPaymentResponse] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission to initiate payment
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Payment initiation failed");
            }

            const data = await response.json();
            setPaymentResponse(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0132] to-[#090114] text-white px-4 sm:px-6 md:px-8">
            {/* Floating Astrology Icons */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="absolute top-10 left-8 md:left-16 animate-bounce text-purple-400 text-3xl sm:text-4xl">💫</span>
                <span className="absolute bottom-10 right-8 md:right-16 animate-pulse text-yellow-400 text-2xl sm:text-3xl">♉</span>
                <span className="absolute top-20 right-4 md:right-8 animate-spin text-blue-400 text-xl sm:text-2xl">🌙</span>
            </div>

            <div className="bg-[#1e0836] p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg border border-purple-500 relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-4 sm:mb-6">Payment</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-500 text-white text-center rounded-lg">
                        {error}
                    </div>
                )}

                {paymentResponse ? (
                    <div className="p-4 border border-purple-500 rounded-lg text-center bg-[#2a0c4e]">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Payment Initiated</h3>
                        <p className="mb-2">
                            <span className="font-semibold text-white">Payment URL:</span>{" "}
                            <a
                                href={paymentResponse.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                            >
                                {paymentResponse.paymentUrl}
                            </a>
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold text-white">Transaction ID:</span> {paymentResponse.transactionId}
                        </p>
                        <button
                            className="mt-4 bg-gradient-to-r from-purple-500 to-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-purple-500 transition"
                            onClick={() => navigate("/dashboard")}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input Fields with Icons */}
                        {[
                            { name: "bookingId", placeholder: "Booking ID", icon: "📄", type: "text" },
                            { name: "amount", placeholder: "Amount", icon: "💰", type: "number" },
                            { name: "upiId", placeholder: "UPI ID", icon: "🏦", type: "text" },
                        ].map(({ name, placeholder, icon, type }) => (
                            <div key={name} className="relative group">
                                <input
                                    type={type}
                                    name={name}
                                    placeholder={placeholder}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a0c4e] border border-purple-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 pl-12 transition"
                                    required
                                />
                                <span className="absolute left-3 top-3 text-yellow-400 group-focus-within:translate-x-1 transition">
                                    {icon}
                                </span>
                            </div>
                        ))}

                        {/* Initiate Payment Button */}
                        <button
                            type="submit"
                            className="w-full p-3 bg-gradient-to-r from-purple-500 to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:from-yellow-400 hover:to-purple-500 transition"
                        >
                            Initiate Payment
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
