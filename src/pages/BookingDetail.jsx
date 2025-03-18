// src/BookingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';

const BookingDetail = () => {
    const { id } = useParams(); // This is the astrologer ID.
    const { user } = useSelector((state) => state.auth);
    const [booking, setBooking] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);
    const [bookingError, setBookingError] = useState(null);
    const navigate = useNavigate();

    // Simulate fetching booking details on mount.
    useEffect(() => {
        // This is a placeholder for your booking details API call.
        setBooking({
            bookingId: id,
            astrologerId: id,
            timeSlot: '2025-03-20T15:00:00Z',
            status: 'Pending',
        });
    }, [id]);

    // Function to format Date object to YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Function to fetch available slots based on the selected date.
    const fetchAvailableSlots = async (date) => {
        const formattedDate = formatDate(date);
        setLoadingSlots(true);
        setError(null);
        try {
            const response = await fetch('/api/booking/astrologer/available-slots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    astrologer_id: Number(id),
                    slot_date: formattedDate
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch available slots.');
            }
            const data = await response.json();
            setAvailableSlots(data.availableSlots || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingSlots(false);
        }
    };

    // Handle calendar date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchAvailableSlots(date);
    };

    // Handle click on a time slot row
    const handleSlotClick = async (slot) => {
        console.log(`Selected slot: ${slot.slot_date} ${slot.start_time} - ${slot.end_time}`);
        // Create a booking entry
        try {
            const bookingPayload = {
                booking_id:uuidv4(),
                user_id: user.id,
                astrologer_id: Number(id),
                // Assuming slot.slot_date contains the date and slot.start_time the time
                time_slot: slot.slot_date,
                status: 'Pending'
            };
            console.log('Booking payload:', bookingPayload);

            const response = await fetch('/api/booking/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to create booking.');
            }

            // Optionally, parse the response if needed.
            const bookingData = await response.json();

            // Notify both the user and the astrologer about the booking.
            // This could be a separate API call or a WebSocket event.
            // await notifyBooking(bookingData);

            // Redirect or update UI as needed (for example, navigate to a booking confirmation page).
            navigate('/payment', { state: { bookingData } });

        } catch (err) {
            setBookingError(err.message);
        }
    };

    // Function to send notifications (dummy implementation)
    // const notifyBooking = async (bookingData) => {
    //     try {
    //         const response = await fetch('/api/notifications', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 bookingId: bookingData.bookingId,
    //                 userId: bookingData.userId,
    //                 astrologerId: bookingData.astrologerId,
    //                 message: 'A new booking has been created.'
    //             })
    //         });
    //         if (!response.ok) {
    //             console.error('Notification failed.');
    //         }
    //     } catch (err) {
    //         console.error('Notification error:', err);
    //     }
    // };

    if (!booking) return <div>Loading booking details...</div>;

    return (
        <div className="p-4 border rounded">
            <h2 className="text-2xl font-bold mb-4">Booking Detail</h2>
            <p>Booking ID: {booking.bookingId}</p>
            <p>Time Slot: {new Date(booking.timeSlot).toLocaleString()}</p>
            <p>Status: {booking.status}</p>

            <div className="my-6">
                <h3 className="text-xl font-semibold mb-2">Select a Date:</h3>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Click to select a date"
                    className="border p-2 rounded"
                />
            </div>

            <div className="my-6">
                <h3 className="text-xl font-semibold mb-2">Available Slots:</h3>
                {loadingSlots && <p>Loading slots...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loadingSlots && availableSlots.length === 0 && selectedDate && (
                    <p>No available slots for this date.</p>
                )}
                {!loadingSlots && availableSlots.length > 0 && (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableSlots.map(slot => (
                                <tr
                                    key={slot.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    <td className="border px-4 py-2">{new Date(slot.slot_date).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">
                                        {slot.start_time} - {slot.end_time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {bookingError && <p className="text-red-500 mt-4">{bookingError}</p>}
            </div>

            <div className="mt-4 flex space-x-4">
                <Link
                    to={`/chat/chat_${booking.astrologerId}_${user.id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Open Chat
                </Link>
                <Link
                    to="/payment"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Make Payment
                </Link>
            </div>
        </div>
    );
};

export default BookingDetail;
