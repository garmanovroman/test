import React, { Component } from 'react';
import Network from './Requests';
import { useSelector, useDispatch } from 'react-redux';
import { setLockImg } from '../store/reducers/variantSlice';
import { MenuCard } from './RenderCards/components/MenuCard';
import { Box, CircularProgress, MenuItem } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import { useLongPress } from './RenderCards/hook/useLongPress';
import VideoPreview from './VideoPreview';
import ReactPlayer from 'react-player';
import VideoPlayer from './VideoPlayer.js';
import logo from '../images/var_logo.png';
import { setList, setStateOpen } from '../store/reducers/downloadSlice.js';
import RoundCheckbox from './RoundCheckbox.js';

const ImageComponent = (props) => {
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

  const statusSelectMessage = useSelector((state) => state.download.state);
  const selectMessage = useSelector((state) => state.download.list);

  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (isMobile) {
      setStateHelper({ isMobile: true });
    }
  }, []);

  const requestInfoForMenu = React.useCallback(async ({ event }) => {
    const { dataset } = event.currentTarget;
    const requestId = dataset?.requestid ? dataset?.requestid : '';
    if (event?.currentTarget) {
      setStateHelper({ requestId });
    }

    const fetch = async () => {
      let folders = [
        { name: 'Выгрузить в галерею', type: 'download' },
        { name: 'Выбрать', type: 'select' },
      ];
      setStateHelper({ requestId: '', menuCardData: folders, currentChat: requestId });
      menuRef.current.show(event);
    };
    fetch();
  }, []);

  const download = (url) => {
    fetch(url, {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', props?.guid + '.png'); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const trimGetParameters = (url) => {
    let queryStringStart = url.indexOf('?');

    if (queryStringStart === -1) {
      return url;
    }
    return url.substring(0, queryStringStart);
  };

  const dataEvents = useLongPress({ cb: requestInfoForMenu });

  const handleClickField = (e, item) => {
    if (item?.type == 'select') {
      dispatch(setStateOpen(true));
      console.log(item, 'itemitem');
    } else {
      download(image);
      menuRef.current.hide();
    }
  };

  const handleClickRightButton = (event) => {
    menuRef.current.hide();
    requestInfoForMenu({ event: { ...event } });
  };

  const image = props.props;
  const [open, setOpen] = React.useState(false);
  const handleShowDialog = () => {
    setOpen(!open);
    dispatch(setLockImg(false));
  };
  const filename = image.substr(image.lastIndexOf('/') + 1);
  var fileType;
  var fileName;
  var fileSize;

  const downloadFile = () => {
    new Network().DownloadFileInChat(image, fileType, fileName);
  };

  const preventContextMenu = (event) => {
    event.preventDefault();
  };

  var isUriImage = function (image) {
    var uri = image.split('?')[0];
    //moving on, split the uri into parts that had dots before them
    var parts = uri.split('.');
    //get the last part ( should be the extension )
    var extension = parts[parts.length - 1];
    //define some image types to test against
    var imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp', 'jfif'];
    //check if the extension matches anything in the list.
    if (imageTypes.indexOf(extension) !== -1) {
      return true;
    } else {
      var fileTypes = ['txt', 'pdf', 'docx', 'mp4'];
      if (fileTypes.indexOf(extension) !== -1) {
        fileType = extension;
      }
      parts = parts[parts.length - 2];
      parts = parts.toString().split('/');
      fileName = parts[parts.length - 1];
      // Логина для получения размера файла - надо сделать на бэке
      // var req = new XMLHttpRequest();
      // req.open('GET', image, false);
      // req.send();
      // fileSize = req.getResponseHeader('content-length');
      return false;
    }
  };

  return (
    <>
      <div className="chat-images">
        {isUriImage(image) ? (
          <>
            {statusSelectMessage && <RoundCheckbox urlMedia={image} />}
            <img
              className="chat-image no-select 3"
              src={image}
              data-requestid={image}
              onClick={handleShowDialog}
              // onContextMenu={preventContextMenu}
              {...(state.isMobile ? { ...dataEvents } : { onContextMenu: handleClickRightButton })}
            />
          </>
        ) : (
          <>
            <VideoPlayer
              src={trimGetParameters(props.props)}
              autoplay={true} // Enable auto-play when the video comes into view
              loop={true} // Loop the video
              className="no-select"
              // onContextMenu={preventContextMenu}
              // controls={true} // Show the video controls
            />
            {/* <VideoPlayer videoSrc={props.props} posterSrc={logo} /> */}
            {/* <div className="react-player-wrapper">
              {ReactPlayer.canPlay(props?.props) && (
                <ReactPlayer
                  url={props?.props}
                  controls={true}
                  light={true}
                  playing={false}
                  muted={true}
                  width="100%"
                  height="100%"
                />
              )}
            </div> */}
            {/* <p className="file-area">
              <a className="file-icon" onClick={downloadFile} />
              <a onClick={downloadFile} className="download-black">
                {filename}
              </a>
            </p> */}
          </>
        )}
        {open && (
          <dialog className="dialog" open onClick={handleShowDialog}>
            <img className="dialog-image" src={image} onClick={handleShowDialog} />
          </dialog>
        )}
      </div>
      <MenuCard ref={menuRef} onClick={menuRef.current?.hide}>
        {state.menuCardData?.map((item) => {
          return (
            <MenuItem key={item.id} onClick={(e) => handleClickField(e, item)}>
              <p>{item.name}</p>
            </MenuItem>
          );
        })}
      </MenuCard>
    </>
  );
};

export default ImageComponent;
