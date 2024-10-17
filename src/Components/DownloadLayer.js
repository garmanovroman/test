import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { clear } from '../store/reducers/downloadSlice';
import axios from 'axios';

const styles = {
  bottomPanel: {
    position: 'absolute',
    bottom: '70px',
    left: '30px',
    right: '30px',
    backgroundColor: '#f1f1f1',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #ccc',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '20px',
    cursor: 'pointer',
  },
};

const DownloadLayerMemo = ({
  products,
  currentInterior,
  InteriorClicked,
  groupColor,
  onResetChat,
}) => {
  const [state, setState] = useState({
    items: [],
    isPreloader: false,
    error: '',
    menuCardData: [],
    requestId: '',
    isMobile: false,
    currentChat: '',
  });
  const [selectedMessages, setSelectedMessages] = useState(0);
  const [progress, setProgress] = useState({});
  const setStateHelper = (payload) => setState((prev) => ({ ...prev, ...payload }));
  const dispatch = useDispatch();

  const downloadFile = (fileUrl) => {
    const fileName = fileUrl.split('/').pop(); // Extract file name from URL

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = fileName; // Save to the default directory with file name
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url); // Clean up the URL object
      })
      .catch((error) => {
        console.error('Download error:', error);
      });
  };

  const handleMultipleDownloads = () => {
    selectMessage.forEach((fileUrl) => {
      downloadFile(fileUrl);
    });
    dispatch(clear());
  };

  const statusSelectMessage = useSelector((state) => state.download.state);
  const selectMessage = useSelector((state) => state.download.list);

  const menuRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      {statusSelectMessage && (
        <div className="bottomPanel" style={styles.bottomPanel}>
          <button
            className="select-close"
            onClick={() => {
              dispatch(clear());
            }}></button>
          <span>{selectMessage?.length > 0 ? selectMessage?.length : 0} медиафайлов выбрано</span>
          <button className="select-download" onClick={handleMultipleDownloads}></button>
        </div>
      )}
    </>
  );
};

export const DownloadLayer = React.memo(DownloadLayerMemo);
