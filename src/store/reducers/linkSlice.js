import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  info: {},
  list: [],
  phone: false,
};

export const linkSlice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    linkActive: (state, action) => {
      state.open = action.payload;
    },
    setLink: (state, action) => {
      state.info = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    clear: (state, action) => {
      state.info = {};
      state.phone = false;
    },
  },
});

export const { linkActive, setLink, clear, setList, setPhone } = linkSlice.actions;

export default linkSlice.reducer;
