import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  catalog: [],
  variant: [],
  current: {},
};

export const changeModelSlice = createSlice({
  name: 'changeModel',
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setCatalog: (state, action) => {
      state.catalog = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    clearChangeModel: (state, action) => {
      state.current = {};
    },
  },
});

export const { setOpen, setCatalog, setVariant, setCurrent, clearChangeModel } =
  changeModelSlice.actions;

export default changeModelSlice.reducer;
