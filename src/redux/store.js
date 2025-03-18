// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import bookingReducer from "./slices/bookingSlice.js";
import chatReducer from "./slices/chatSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    chat: chatReducer,
  },
});

export default store;
