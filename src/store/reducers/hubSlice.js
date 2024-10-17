import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hubs: {},
};

export const hubSlice = createSlice({
  name: 'hub',
  initialState,
  reducers: {
    setHub: (state, action) => {
      state.hubs = action.payload;
    },
  },
});

export const { setHub } = hubSlice.actions;

export default hubSlice.reducer;
