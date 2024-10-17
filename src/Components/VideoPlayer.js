import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLongPress } from './RenderCards/hook/useLongPress';
import { isMobile } from 'react-device-detect';
import { MenuCard } from './RenderCards/components/MenuCard';
import { Box, CircularProgress, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { setStateOpen } from '../store/reducers/downloadSlice';
import RoundCheckbox from './RoundCheckbox';

const VideoPlayer = ({ src, autoplay = false, loop = false }) => {
  const videoRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false); // To show user feedback during download
  const [state, setState] = React.useState({
    items: [],
    isPreloader: false,
    error: '',
    menuCardData: [],
    requestId: '',
    isMobile: false,
    currentChat: '',
  });

  const setStateHelper = (payload) => setState((prev) => ({ ...prev, ...payload }));
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const statusSelectMessage = useSelector((state) => state.download.state);
  const selectMessage = useSelector((state) => state.download.list);

  useEffect(() => {
    if (isMobile) {
      setStateHelper({ isMobile: true });
    }
  }, []);

  const requestInfoForMenu = useCallback(async ({ event }) => {
    const { dataset } = event.currentTarget;
    const requestId = dataset?.requestid ? dataset?.requestid : '';
    if (event?.currentTarget) {
      setStateHelper({ requestId });
    }

    const fetch = async () => {
      let folders = [
        { name: 'Скачать видео', type: 'download' },
        { name: 'Выбрать', type: 'select' },
      ];
      setStateHelper({ requestId: '', menuCardData: folders, currentChat: requestId });
      menuRef.current.show(event);
    };
    fetch();
  }, []);

  const dataEvents = useLongPress({ cb: requestInfoForMenu });

  const handleClickField = (item) => {
    menuRef.current.hide();
  };

  const handleClickRightButton = (event) => {
    menuRef.current.hide();
    requestInfoForMenu({ event: { ...event } });
  };

  // Function to download the video
  const downloadVideo = async (e, item) => {
    if (item?.type == 'select') {
      dispatch(setStateOpen(true));
    } else {
      setIsDownloading(true); // Indicate download has started

      try {
        const videoUrl = videoRef.current.src;
        const fileName = getFileNameFromUrl(videoUrl) || 'video.mp4';

        // Fetch the video data as a blob
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create a temporary download link
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', fileName);

        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL and removing the link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        alert('Error downloading the video: ' + error.message); // Show error feedback to the user
      } finally {
        setIsDownloading(false); // Reset download state
      }
    }
  };

  // Helper function to extract file name from URL
  const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.includes('.') ? filename : null;
  };

  return (
    <div className="video-container">
      {statusSelectMessage && <RoundCheckbox urlMedia={src} />}
      <video
        ref={videoRef}
        src={src}
        controls
        loop={loop}
        // onContextMenu={handleContextMenu}
        style={{ cursor: 'pointer' }}
        data-requestid={src}
        {...(state.isMobile ? { ...dataEvents } : { onContextMenu: handleClickRightButton })}
      />
      <MenuCard ref={menuRef} onClick={menuRef.current?.hide}>
        {state.menuCardData?.map((item) => {
          return (
            <MenuItem key={item.id} onClick={(e) => downloadVideo(e, item)}>
              <p>{item.name}</p>
            </MenuItem>
          );
        })}
      </MenuCard>
    </div>
  );
};

export default VideoPlayer;
