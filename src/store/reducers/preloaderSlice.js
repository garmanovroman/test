import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: false,
};

export const preloaderSlice = createSlice({
  name: 'preloader',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setLoader } = preloaderSlice.actions;

export default preloaderSlice.reducer;
