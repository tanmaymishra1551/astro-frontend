// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  loggedIn: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {

      const loggedUser = action.payload;
      // console.log(`Logged User is ${JSON.stringify(loggedUser)}`)
      state.token = loggedUser.accessToken;
      state.loggedIn = loggedUser
    },
    logout(state) {
      state.token = null;
      state.loggedIn = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
