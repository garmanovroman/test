import { Popover } from '@material-ui/core';
import React, { ReactNode, useState, useImperativeHandle, forwardRef } from 'react';

const defaultPosition = {
  top: 0,
  left: 0,
  vertical: 'center',
  horizontal: 'left',
};

const MenuCardMemo = ({ children, ...props }, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [position, setPosition] = useState(defaultPosition);

  const open = Boolean(anchorEl);

  const show = (event) => {
    setPosition((prev) => {
      return {
        ...prev,
        top: event.clientY,
        left: event.clientX,
      };
    });
    setAnchorEl(event.currentTarget);
  };

  const hide = () => {
    setAnchorEl(null);
    setPosition(defaultPosition);
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={{ top: position.top, left: position.left }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}>
      {children}
    </Popover>
  );
};

export const MenuCard = React.memo(forwardRef(MenuCardMemo));
