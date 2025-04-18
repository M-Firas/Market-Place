import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: null,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showPopup: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type;
    },
    hidePopup: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { hidePopup, showPopup } = popupSlice.actions;
export const selectPopupMessage = (state) => state.popup.message;
export const selectPopupType = (state) => state.popup.type;

export default popupSlice.reducer;
