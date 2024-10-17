import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { setCopyTemplate } from '../store/reducers/saveGuids';
import Network from './Requests';

const CopyTemplate = () => {
  const dispatch = useDispatch();
  const copy = useSelector((state) => state.guids.copyTemplate);
  const projectGuid = useSelector((state) => state.variant?.current?.projectGuid);

  const saveTemplate = () => {
    let send = new Network().CopyProjectToCatalog(projectGuid);
    if (send) {
      dispatch(setCopyTemplate(!copy));
    }
  };

  const close = () => {
    dispatch(setCopyTemplate(!copy));
  };

  return (
    <Dialog
      open={copy}
      onClose={() => {
        dispatch(setCopyTemplate(!copy));
      }}>
      <DialogContent className="public-link">
        <div className="share">
          <div className="form--row">
            <div>Вы уверены, что хотите скопировать данный чат в общий каталог фирмы?</div>
          </div>
          <div className="form--row form--row--marg">
            <div class="button" onClick={saveTemplate}>
              Да
            </div>
            <div class="button" onClick={close}>
              Нет
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CopyTemplate;
