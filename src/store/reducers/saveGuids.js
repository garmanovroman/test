import { createSlice } from '@reduxjs/toolkit';
import Network from '../../Components/Requests';

const initialState = {
  project: '',
  guidDisplayType: '',
  usersAddProject: {
    delete: [],
    add: [],
  },
  userGuid: '',
  product: [],
  source: [],
  folders: [],
  groups: [],
  openPublicForm: false,
  copyTemplate: false,
  closeActionPanel: false,
  prevGuidChat: '',
  phone: '',
};

export const guids = createSlice({
  name: 'guids',
  initialState,
  reducers: {
    setPrevGuidChat: (state, action) => {
      state.prevGuidChat = action.payload;
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setDisplayType: (state, action) => {
      state.guidDisplayType = action.payload;
    },
    setCloseActionPanel: (state, action) => {
      state.closeActionPanel = action.payload;
    },
    setOpenPublicForm: (state, action) => {
      state.openPublicForm = action.payload;
    },
    setCopyTemplate: (state, action) => {
      state.copyTemplate = action.payload;
    },
    setProductStore: (state, action) => {
      state.product = action.payload;
    },
    setSourceStore: (state, action) => {
      state.source = action.payload;
    },
    setFolderStore: (state, action) => {
      state.folders = action.payload;
    },
    setGroupsStore: (state, action) => {
      state.groups = action.payload;
    },
    setUserGuid: (state, action) => {
      state.userGuid = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    addUserProject: (state, action) => {
      var users = state.usersAddProject.delete.filter((el) => {
        return el.userGuid != action.payload.userGuid;
      });
      state.usersAddProject.delete = users;
      state.usersAddProject.add.push(action.payload);
    },
    deleteUserProject: (state, action) => {
      var users = state.usersAddProject.add.filter((el) => {
        return el.userGuid != action.payload.userGuid;
      });
      state.usersAddProject.add = users;
      state.usersAddProject.delete.push(action.payload);
    },
    clearUsers: (state, action) => {
      state.usersAddProject.add = [];
      state.usersAddProject.delete = [];
    },
  },
});

export const {
  setProject,
  addUserProject,
  deleteUserProject,
  clearUsers,
  setUserGuid,
  setProductStore,
  setSourceStore,
  setFolderStore,
  setGroupsStore,
  setOpenPublicForm,
  setCopyTemplate,
  setCloseActionPanel,
  setPrevGuidChat,
  setDisplayType,
  setPhone,
} = guids.actions;

export default guids.reducer;
