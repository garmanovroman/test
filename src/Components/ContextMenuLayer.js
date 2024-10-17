import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Network from './Requests';
// import { ContextMenu } from 'primereact/contextmenu';
import { useLongPress } from 'use-long-press';
import { useMenuForProductsContext } from './AddMenuForItemsProducts';

export default function ContextMenuLayer(props) {
  console.log(props, 'propspropsprops');
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const contextMenuComponent = useMenuForProductsContext();
  // const [selectedId, setSelectedId] = useState('');

  // const cm = useRef(0);

  // const callback = async (event, item) => {
  //   console.log(item, 'itemitemitem');
  //   var storage = localStorage.getItem('company');
  //   var storageCompany = JSON.parse(storage);

  //   let folders = await new Network().GetGroups(storageCompany.id, item?.projectGuid);

  //   if (folders?.length > 0 && String(folders[0]) != 'null') {
  //     for (let i = 0; i < folders.length; i++) {
  //       const element = folders[i];
  //       folders[i].label = element?.name;
  //       folders[i].command = async () => {
  //         const result = await new Network().MoveProjectInGroup(item?.projectGuid, element?.guid);
  //         props.onResetChat();
  //       };
  //     }
  //   } else {
  //     folders = [{ label: 'Нет групп для переноса' }];
  //   }
  //   setItems(folders);

  //   setTimeout(() => {
  //     // cm.current.show(event);
  //     if (cm.current) {
  //       setSelectedId(item?.projectGuid);
  //       cm.current.show(event);
  //     }

  //     document.querySelector('.p-contextmenu').style.top = event.clientY + 'px';
  //     document.querySelector('.p-contextmenu').style.left = event.clientX + 'px';
  //   }, 5);
  // };

  // const bind = useLongPress((e, guid) => callback(e, props?.item), {
  //   captureEvent: true,
  // });

  return (
    <>
      <div
        className="context-menu-layer"
        onClick={() => props.onClickInterior(props?.item)}
        onContextMenu={(e) => contextMenuComponent.config.onRightClick(e, props?.item?.projectGuid)}
        // {...bind()}
      ></div>
      {/* <ContextMenu onHide={() => setSelectedId('')} model={items} ref={cm} breakpoint="767px" /> */}
    </>
  );
}
