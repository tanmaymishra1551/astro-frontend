// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  astrologer: null, // New field for astrologer users
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const user = action.payload.data.user;
      state.token = action.payload.data.jwtToken;
      localStorage.setItem("token", action.payload.data.jwtToken);
      // Segregate user based on role
      if (user.role === "astrologer") {
        state.astrologer = user;
        state.user = null;
      } else {
        state.user = user;
        state.astrologer = null;
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.astrologer = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
