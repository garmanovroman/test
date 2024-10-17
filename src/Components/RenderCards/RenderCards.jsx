import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { getRandomFieldsMenu, resServerData } from './data/DataProducts';
import { useLongPress } from './hook/useLongPress';

import defaultImg from '../../images/def_chat.png';
import CreateProject from '../CreateProject';
import { MenuCard } from './components/MenuCard';
import { Box, CircularProgress, MenuItem } from '@material-ui/core';
import Network from '../Requests';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';

const RenderCardsMemo = ({
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
    phoneProject: '',
  });

  const setStateHelper = (payload) => setState((prev) => ({ ...prev, ...payload }));

  const menuRef = useRef(null);

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
    console.log('test phone 6');
    const fetch = async () => {
      var storage = localStorage.getItem('company');
      var storageCompany = JSON.parse(storage);
      let folders = await new Network().GetGroups(storageCompany.id, requestId);
      if (folders?.length == 0) {
        folders.push({ name: 'Нет групп для переноса' });
      }

      const phone = dataset?.phonenumber ? dataset?.phonenumber : '';

      if (phone?.length > 0) {
        folders.push({ name: 'Скопировать номер', type: 'copy', phone: phone });
      }

      setStateHelper({ requestId: '', menuCardData: folders, currentChat: requestId });
      menuRef.current.show(event);
    };
    fetch();
  });

  const dataEvents = useLongPress({ cb: requestInfoForMenu });

  const handleClickField = (item) => {
    const fetch = async () => {
      const result = await new Network().MoveProjectInGroup(state?.currentChat, item?.guid);
      onResetChat();
    };
    if (item?.guid) {
      fetch();
    }

    menuRef.current.hide();
  };

  function copyToClipboard(text) {
    if (typeof text !== 'undefined' && text !== null) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          // console.log('Text copied to clipboard: ' + text);
        })
        .catch(function (error) {
          console.error('Failed to copy text: ', error);
        });
    } else {
      console.error('The text variable is undefined or null.');
    }
  }

  const handleCopy = (phone) => {
    copyToClipboard(phone);
    menuRef.current.hide();
  };

  const handleClickRightButton = (event) => {
    menuRef.current.hide();
    requestInfoForMenu({ event: { ...event } });
  };

  return (
    <>
      {products.map((c, index) => {
        return (
          <div
            key={c.projectGuid + '-' + c.guidDisplayTape}
            className="project-wth-dell"
            style={{ position: 'relative' }}>
            <div
              id={c.projectGuid}
              data-requestid={c.projectGuid}
              data-phonenumber={c.phoneNumber}
              {...(state.isMobile ? { ...dataEvents } : { onContextMenu: handleClickRightButton })}
              className={
                c.guidDisplayTape == null
                  ? c.projectGuid == currentInterior?.projectGuid
                    ? 'flex pr-item active'
                    : 'flex pr-item'
                  : c.guidDisplayTape == currentInterior?.guidDisplayTape
                  ? 'flex pr-item active' +
                    ' ' +
                    c.guidDisplayTape +
                    ' ' +
                    currentInterior?.guidDisplayTape
                  : 'flex pr-item' +
                    ' ' +
                    c.guidDisplayTape +
                    ' ' +
                    currentInterior?.guidDisplayTape
              }
              key={c.projectGuid}
              onClick={() => InteriorClicked(c)}>
              <div
                style={{
                  backgroundColor: c.currentCRMGroup != null ? c.currentCRMGroup.color : groupColor,
                }}
                className="project-color"></div>
              <div
                className="pr-photo"
                style={{
                  backgroundImage: `url("${
                    c.projectSmallPicturePath !== null
                      ? // ? c.projectSmallPicturePath + '?' + performance.now()
                        c.projectSmallPicturePath
                      : defaultImg
                  }`,
                }}>
                {c?.isAuthor && <div className="author">A</div>}
              </div>
              <div className="pr-info">
                <div className="pr-title">
                  {c.name.length > 24 ? c.name.substr(0, 61) + '...' : c.name}
                </div>
                <div className="pr-descr">
                  {c.lastMessage?.content !== null &&
                    c.lastMessage?.content !== undefined &&
                    (c.lastMessage?.content !== null &&
                    c.lastMessage?.content !== undefined &&
                    c.lastMessage?.content?.length > 24
                      ? c.lastMessage?.content.substr(0, 35) + '...'
                      : c.lastMessage?.content)}
                </div>
                {/* <span>
                            {c.unreadMessagesCount > 0 && c.forDisplayTape == false
                              ? c.unreadMessagesCount
                              : ''}
                          </span> */}
                {c.forDisplayTape == false ? (
                  <div className="pr-container">
                    <div className="pr-counter">
                      {c.unreadMessagesCount > 0 && c.forDisplayTape == false && (
                        <div className="pr-counter--item view">{c.unreadMessagesCount}</div>
                      )}
                      {c.unreadMessagesCount > 0 && c.forDisplayTape == false && <span>1</span>}
                      {/* <div className="pr-counter--item share">{c.shareCount}</div>
                              <div className="pr-counter--item entry">{c.entryCount}</div> */}
                    </div>
                  </div>
                ) : (
                  <div className="pr-container">{c.displayTapeCreatedAt}</div>
                )}
              </div>
            </div>
            {c.forDisplayTape == true && <CreateProject guid={c?.guidDisplayTape} />}

            {state.requestId === c.projectGuid && (
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <CircularProgress size={20} />
              </div>
            )}
          </div>
        );
      })}

      <MenuCard ref={menuRef} onClick={menuRef.current?.hide}>
        {state.menuCardData?.map((item) => {
          return item?.type == 'copy' ? (
            <>
              <hr class="phoneS" />
              <MenuItem key={item.id} onClick={() => handleCopy(item.phone)}>
                <p className="no-select">{item.name}</p>
              </MenuItem>
            </>
          ) : (
            <MenuItem key={item.id} onClick={() => handleClickField(item)}>
              <p className="no-select">{item.name}</p>
            </MenuItem>
          );
        })}
      </MenuCard>
    </>
  );
};

export const RenderCards = React.memo(RenderCardsMemo);

{
  /* <List className="flex flex-col">
        {state.items.map(({ name, id }) => (
          <ListItem key={id} className={name} sx={{ justifyContent: 'center' }}>
            <CardItem
              className="relative"
              data-requestid={id}
              title={name}
              isPreloader={state.requestId === id}
              {...(state.isMobile ? { ...dataEvents } : { onContextMenu: handleClickRightButton })}
              >
              <div className="m-0 p-0">Наполнение карты</div>
            </CardItem>
          </ListItem>
        ))}
      </List> */
}
