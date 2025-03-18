// src/redux/slices/bookingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    selectedBooking: null,
  },
  reducers: {
    setBookings(state, action) {
      state.bookings = action.payload;
    },
    setSelectedBooking(state, action) {
      state.selectedBooking = action.payload;
    },
  },
});

export const { setBookings, setSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
