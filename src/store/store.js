import { configureStore } from '@reduxjs/toolkit';
import variantSlice from './reducers/variantSlice';
import projectSlice from './reducers/projectSlice';
import usersSlice from './reducers/usersSlice';
import inviteLinkSlice from './reducers/inviteLinkSlice';
import guids from './reducers/saveGuids';
import preloader from './reducers/preloaderSlice';
import hub from './reducers/hubSlice';
import linkSlice from './reducers/linkSlice';
import changeModelSlice from './reducers/changeModelSlice';
import analyticsSlice from './reducers/analyticsSlice';
import downloadSlice from './reducers/downloadSlice';

export const store = configureStore({
  reducer: {
    variant: variantSlice,
    project: projectSlice,
    users: usersSlice,
    inviteLink: inviteLinkSlice,
    guids: guids,
    preloader: preloader,
    hub: hub,
    link: linkSlice,
    changeModel: changeModelSlice,
    analytics: analyticsSlice,
    download: downloadSlice,
  },
});
