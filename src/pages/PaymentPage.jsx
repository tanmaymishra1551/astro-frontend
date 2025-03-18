// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [formData, setFormData] = useState({
        bookingId: '',
        amount: '',
        upiId: '',
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
            const response = await fetch('http://localhost:8080/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Payment initiation failed');
            }

            const data = await response.json();
            setPaymentResponse(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Payment Page</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-600">
                    {error}
                </div>
            )}
            {paymentResponse ? (
                <div className="p-4 border rounded">
                    <h3 className="text-xl font-bold mb-2">Payment Initiated</h3>
                    <p className="mb-2">
                        <span className="font-semibold">Payment URL:</span>{' '}
                        <a
                            href={paymentResponse.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {paymentResponse.paymentUrl}
                        </a>
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Transaction ID:</span>{' '}
                        {paymentResponse.transactionId}
                    </p>
                    <button
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => navigate('/dashboard')}
                    >
                        Return to Dashboard
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-gray-700">Booking ID</span>
                        <input
                            type="text"
                            name="bookingId"
                            value={formData.bookingId}
                            onChange={handleChange}
                            placeholder="Enter Booking ID"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Amount</span>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter Amount"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">UPI ID</span>
                        <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            placeholder="yourupi@bank"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                        Initiate Payment
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaymentPage;
