// sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: 1, // You can set the initial value to 0, 1, 2, or 3
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveLink: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setActiveLink } = sidebarSlice.actions;
export default sidebarSlice.reducer;
