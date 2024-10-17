import { useState, useRef } from 'react';

export default function useLongPress() {
  const [action, setAction] = useState();

  const timerRef = useRef();
  const isLongPress = useRef();

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
    }, 500);
  }

  function handleOnClick(e) {
    if (isLongPress.current) {
      return;
    }
    setAction('click');
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
    },
  };
}
