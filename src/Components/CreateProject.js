import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import createSlice from '../store/reducers/projectSlice';
import { useSelector, useDispatch } from 'react-redux';
import { addList, remove, setCompany } from '../store/reducers/projectSlice';

export default function CreateProject(props) {
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.project.companyId);
  const projectUnite = useSelector((state) => state.project.list);

  const handleChange = (e, guid) => {
    if (e.target.checked == true) {
      dispatch(addList(guid));
    } else {
      dispatch(remove(guid));
    }
  };

  return (
    <>
      {companyId > 0 && (
        <div className="pr-create" id={props.guid}>
          <Checkbox
            checked={projectUnite.includes(props.guid)}
            onChange={(e) => handleChange(e, props.guid)}
            classes={{ root: 'pr-checkbox' }}
            style={{
              transform: 'scale(1.5)',
            }}
          />
        </div>
      )}
    </>
  );
}
