import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    uploadUserStart: (state) => {
      state.isLoading = true;
    },
    uploadUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    uploadUserFailuer: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteUserStart: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    deleteUserFailuer: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    signOutUserStart: (state) => {
      state.isLoading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    signOutUserFailuer: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  uploadUserStart,
  uploadUserSuccess,
  uploadUserFailuer,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailuer,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailuer,
} = userSlice.actions;

export default userSlice.reducer;
