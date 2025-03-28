// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  astrologer: null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {

      const loggedUser = action.payload;
      state.token = loggedUser.accessToken;
      // Segregate user based on role
      if (loggedUser.user.role === "astrologer") {
        state.astrologer = loggedUser.user;
        state.user = null;
      } else {
        state.user = loggedUser;
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
