import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setOpenAnalytics: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setOpenAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;
