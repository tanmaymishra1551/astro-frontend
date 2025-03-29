import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaUserCircle, FaBell } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

const BookingDetail = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { id } = useParams();
    // console.log(`Astrloger id from user dasboard page is ${id}`);
    const user  = useSelector((state) => state.auth);
    const userID = user.loggedIn.id;
    const [booking, setBooking] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);
    const [bookingError, setBookingError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setBooking({
            bookingId: id,
            astrologerId: id,
            timeSlot: '2025-03-20T15:00:00Z',
            status: 'Pending',
        });
    }, [id]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchAvailableSlots = async (date) => {
        const formattedDate = formatDate(date);
        setLoadingSlots(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/booking/astrologer/available-slots`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    astrologer_id: Number(id),
                    slot_date: formattedDate
                })
            });
            if (!response.ok) throw new Error('Failed to fetch available slots.');
            const data = await response.json();
            setAvailableSlots(data.availableSlots || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchAvailableSlots(date);
    };

    const handleSlotClick = async (slot) => {
        try {
            const bookingPayload = {
                booking_id: uuidv4(),
                user_id: userID,
                astrologer_id: Number(id),
                time_slot: slot.slot_date,
                status: 'Pending'
            };

            const response = await fetch(`${API_BASE_URL}/booking/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to create booking.');
            }

            const bookingData = await response.json();
            navigate('/payment', { state: { bookingData } });

        } catch (err) {
            setBookingError(err.message);
        }
    };

    if (!booking) return <div className="text-yellow-400 text-center">Loading booking details...</div>;

    return (
        <>
            {/* Header */}
            <header className="bg-[#1e0138] shadow p-4 flex justify-between items-center">
                <div className="text-lg font-semibold text-yellow-400">Welcome</div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <FaBell className="text-2xl text-yellow-400 cursor-pointer hover:text-yellow-300" />

                    {/* Profile Section */}
                    <div className="relative">
                        <FaUserCircle
                            className="text-3xl text-yellow-400 cursor-pointer hover:text-yellow-300"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#2c024b] text-yellow-400 rounded-lg shadow-lg">
                                <button className="block px-4 py-2 hover:bg-[#3a035f] w-full text-left">Profile</button>
                                <button className="block px-4 py-2 hover:bg-[#3a035f] w-full text-left">Notifications</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-[#3a035f]">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Booking Details */}
            <div className="p-6 bg-[#2c024b] text-yellow-400 rounded-lg shadow-lg mx-auto mt-6 max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Booking Detail</h2>
                <p>Booking ID: {booking.bookingId}</p>
                <p>Time Slot: {new Date(booking.timeSlot).toLocaleString()}</p>
                <p>Status: {booking.status}</p>

                {/* Date Picker */}
                <div className="my-6">
                    <h3 className="text-xl font-semibold mb-2">Select a Date:</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Click to select a date"
                        className="border p-2 rounded w-full text-black"
                    />
                </div>

                {/* Available Slots */}
                <div className="my-6">
                    <h3 className="text-xl font-semibold mb-2">Available Slots:</h3>
                    {loadingSlots && <p className="text-yellow-400">Loading slots...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loadingSlots && availableSlots.length === 0 && selectedDate && (
                        <p className="text-yellow-400">No available slots for this date.</p>
                    )}
                    {!loadingSlots && availableSlots.length > 0 && (
                        <table className="w-full border border-yellow-400 rounded-lg">
                            <thead>
                                <tr className="bg-[#3a035f]">
                                    <th className="px-4 py-2 border border-yellow-400">Date</th>
                                    <th className="px-4 py-2 border border-yellow-400">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableSlots.map((slot) => (
                                    <tr
                                        key={slot.id}
                                        className="cursor-pointer hover:bg-[#47116a]"
                                        onClick={() => handleSlotClick(slot)}
                                    >
                                        <td className="border border-yellow-400 px-4 py-2">
                                            {new Date(slot.slot_date).toLocaleDateString()}
                                        </td>
                                        <td className="border border-yellow-400 px-4 py-2">
                                            {slot.start_time} - {slot.end_time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {bookingError && <p className="text-red-500 mt-4">{bookingError}</p>}
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-4">
                    <Link
                        to={`/chat/chat_${booking.astrologerId}_${userID}`}
                        state={{ astrologerId: booking.astrologerId }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Open Chat
                    </Link>
                    <Link
                        to="/payment"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Make Payment
                    </Link>
                </div>
            </div>
        </>
    );
};

export default BookingDetail;
