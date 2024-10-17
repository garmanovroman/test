import React, { useState } from 'react';
import { setList, deleteItem, addItem } from '../store/reducers/downloadSlice';
import { useSelector, useDispatch } from 'react-redux';

const RoundCheckbox = ({ urlMedia }) => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  const listMedia = useSelector((state) => state.download.list);

  const trimUrlParams = (url) => {
    const urlObject = new URL(url);

    urlObject.search = '';

    return urlObject.toString();
  };

  const handleCheckboxChange = () => {
    if (!isChecked) {
      dispatch(addItem(trimUrlParams(urlMedia)));
    } else {
      dispatch(deleteItem(trimUrlParams(urlMedia)));
    }
    setIsChecked(!isChecked);
  };

  return (
    <label className="round-checkbox-container">
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      <span className="checkmark"></span>
    </label>
  );
};

export default RoundCheckbox;
