import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  usersList: [],
  currentUser: {},
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload;
    },
    setUserList: (state, action) => {
      state.usersList = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setShow, setUserList, setCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;
