import { createSlice } from '@reduxjs/toolkit';
import Network from '../../Components/Requests';

const initialState = {
  list: [],
  companyId: 'null',
  templateStatusOpen: false,
  templateList: [],
  currentParentStructureId: null,
  breadcrumbs: [{ name: 'Категория', id: null }],
  needUpdate: false,
  templateSelect: '',
  templateAdd: '',
  saveVariant: false,
  levelCatalog: 0,
  guidSaveProject: '',
  projectUserCounters: {},
  groupUpdate: {},
  countUser: '',
  idAccess: '',
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addList: (state, action) => {
      state.list.push(action.payload);
    },
    setIdAccess: (state, action) => {
      state.idAccess = action.payload;
    },
    remove: (state, action) => {
      state.list = state.list.filter((list) => list !== action.payload);
    },
    setCompany: (state, action) => {
      state.companyId = action.payload;
    },
    clearList: () => initialState,
    templateOpenStatus: (state, action) => {
      state.templateStatusOpen = action.payload;
    },
    setTemplateList: (state, action) => {
      state.templateList = action.payload;
    },
    setGuidSaveProject: (state, action) => {
      state.guidSaveProject = action.payload;
    },
    setParentStructureId: (state, action) => {
      state.currentParentStructureId = action.payload;
    },
    addBreadcrumbs: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    removeBreadcrumbs: (state, action) => {
      state.breadcrumbs = state.breadcrumbs.slice(0, -1);
    },
    setNeedUpdate: (state, action) => {
      state.needUpdate = action.payload;
    },
    setTemplateSelection: (state, action) => {
      state.templateSelect = action.payload;
    },
    setTemplateAdd: (state, action) => {
      state.templateAdd = action.payload;
    },
    setSaveVariant: (state, action) => {
      state.saveVariant = action.payload;
    },
    levelIncrement: (state, action) => {
      state.levelCatalog = state.levelCatalog + 1;
    },
    levelDecrement: (state, action) => {
      state.levelCatalog = state.levelCatalog - 1;
    },
    setProjectUserCounters: (state, action) => {
      state.projectUserCounters = action.payload;
    },
    setGroupUpdate: (state, action) => {
      state.groupUpdate = action.payload;
    },
    setCountUser: (state, action) => {
      state.countUser = action.payload;
    },
  },
});

export const {
  addList,
  remove,
  setCompany,
  clearList,
  templateOpenStatus,
  setTemplateList,
  setParentStructureId,
  addBreadcrumbs,
  removeBreadcrumbs,
  setNeedUpdate,
  setTemplateSelection,
  setSaveVariant,
  levelIncrement,
  levelDecrement,
  setTemplateAdd,
  setGuidSaveProject,
  setProjectUserCounters,
  setGroupUpdate,
  setCountUser,
  setIdAccess,
} = projectSlice.actions;

export default projectSlice.reducer;
