import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import Network from '../../Components/Requests';

const initialState = {
  list: [],
  current: {},
  changeUser: {},
  addDisplayType: false,
  frameLoad: false,
  firstOpen: true,
  lockImg: true,
};

export const variantSlice = createSlice({
  name: 'variant',
  initialState,
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    setLockImg: (state, action) => {
      state.lockImg = action.payload;
    },
    setFrameLoad: (state, action) => {
      state.frameLoad = action.payload;
    },
    add: (state, action) => {
      state.list = state.list.map((l) => {
        l.isMainVariant = false;
        return l;
      });
      state.list.push(action.payload);
    },
    deleteItem: async (state, action) => {
      new Network().DeleteVariant(action.payload.calculationGuid);
      state.list = state.list.filter(
        (list) => list.calculationGuid !== action.payload.guidCalculation,
      );
      state.list[state.list.length - 1].isMainVariant = true;
      state.current = state.list[state.list.length - 1];
    },
    changeUserState: (state, action) => {
      state.changeUser = action.payload;
    },
    setDisplayType: (state, action) => {
      state.addDisplayType = action.payload;
    },
  },
});

export const {
  setList,
  setCurrent,
  add,
  deleteItem,
  changeUserState,
  setDisplayType,
  setFrameLoad,
  setLockImg,
  setGuidChat,
} = variantSlice.actions;

export default variantSlice.reducer;
