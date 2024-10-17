import React, { useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { setCompany } from '../store/reducers/projectSlice';
import {} from '../store/reducers/hubSlice';

export default function SelectCompany(props) {
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.project.companyId);
  const userInfo = useSelector((state) => state.users.currentUser);
  const hub = useSelector((state) => state.hub.hubs);

  useEffect(() => {
    if (props.companyId) {
      dispatch(setCompany(props.companyId));
      localStorage.setItem('company', JSON.stringify({ id: props.companyId }));
    } else {
      const isDefaultCompany = props?.company?.find((company) => company?.isDefaultCompany == true);
      dispatch(setCompany(isDefaultCompany?.id));
    }
  }, [props.company]);

  const handleChange = (event) => {
    props.onChangeCompany(event.target.value);
    dispatch(setCompany(event.target.value));
    localStorage.setItem('company', JSON.stringify({ id: event.target.value }));
  };

  return (
    <>
      {userInfo && (
        <div className="user-info-container">
          <img src={userInfo.profilePictureFilePath} className="user-picture"></img>
          <div className="user-name--top">
            {userInfo.name + ' ' + userInfo.lastName && userInfo.lastName}
          </div>
        </div>
      )}
      {hub?.connectionStarted ? (
        <FormControl className="select-company" variant="outlined">
          {companyId && (
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={companyId}
              onChange={handleChange}
              label="Age">
              {props?.company?.map((c) => {
                return <MenuItem value={c.id}>{c.name}</MenuItem>;
              })}
            </Select>
          )}
        </FormControl>
      ) : (
        <FormControl className="select-company" variant="outlined" disabled>
          {companyId && (
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={companyId}
              onChange={handleChange}
              label="Age">
              {props?.company?.map((c) => {
                return <MenuItem value={c.id}>{c.name}</MenuItem>;
              })}
            </Select>
          )}
        </FormControl>
      )}
    </>
  );
}
