import { createSlice } from '@reduxjs/toolkit';
import Network from '../../Components/Requests';

const initialState = {
  list: [],
  state: false,
};

export const download = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    addItem: (state, action) => {
      console.log(action.payload, 'payload');
      state.list.push(action.payload);
    },
    setStateOpen: (state, action) => {
      state.state = action.payload;
    },
    deleteItem: (state, action) => {
      state.list = state.list.filter((item) => item !== action.payload);
    },
    clear: (state, action) => {
      state.list = [];
      state.state = false;
    },
  },
});

export const { setList, setStateOpen, clear, deleteItem, addItem } = download.actions;

export default download.reducer;
