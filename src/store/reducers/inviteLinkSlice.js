import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  types: '',
  accessToken: '',
  project: '',
  guidCalculation: '',
  calculationName: '',
  actorNumber: '',
  extraUrlParams: '',
  chatGuid: '',
  userGuid: '',
  room: '',
  startup3DType: '',
};

export const inviteLinkSlice = createSlice({
  name: 'inviteLink',
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.types = action.payload;
    },
    setStartup3DType: (state, action) => {
      state.startup3DType = action.payload;
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setGuidCalculation: (state, action) => {
      state.guidCalculation = action.payload;
    },
    setCalculationName: (state, action) => {
      state.calculationName = action.payload;
    },
    setActorNumber: (state, action) => {
      state.actorNumber = action.payload;
    },
    setExtraUrlParams: (state, action) => {
      state.extraUrlParams = action.payload;
    },
    setChatGuid: (state, action) => {
      state.chatGuid = action.payload;
    },
    setUserGuid: (state, action) => {
      state.userGuid = action.payload;
    },
    setRoomGuid: (state, action) => {
      state.room = action.payload;
    },
  },
});

export const {
  setTypes,
  setAccessToken,
  setProject,
  setActorNumber,
  setCalculationName,
  setGuidCalculation,
  setExtraUrlParams,
  setChatGuid,
  setUserGuid,
  setRoomGuid,
  setStartup3DType,
} = inviteLinkSlice.actions;

export default inviteLinkSlice.reducer;
