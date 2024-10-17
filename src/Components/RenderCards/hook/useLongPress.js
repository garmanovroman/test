import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export const useLongPress = ({ cb, time = 300 }) => {
  const [state, setState] = useState({
    isSuccess: false,
  });

  const configRef = useRef({
    isDown: false,
    isUp: true,
  });

  const payloadRef = useRef({
    event: null,
  });

  useEffect(() => {
    window.oncontextmenu = function () {
      return false;
    };
  }, []);

  const startTimeout = (payload) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      if (configRef.current.isDown) {
        configRef.current.isDown = false;
        configRef.current.isUp = true;
        setState((prev) => ({ ...prev, isSuccess: true }));
        cb({ event: payload });
      }
    }, time);
  };

  const onPointerDown = useCallback((e) => {
    if (e.button === 0) {
      e.persist();
      e.preventDefault();
      e.stopPropagation();
      payloadRef.current.event = e;
      configRef.current.isDown = true;
      configRef.current.isUp = false;

      setState((prev) => ({ ...prev, isSuccess: false }));
      startTimeout({ ...e });
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (e.button === 0) {
      if (configRef.current.isDown && !configRef.current.isUp) {
        e.persist();
        e.preventDefault();
        e.stopPropagation();
        console.log('onPointerMove', e);
        payloadRef.current.event = e;
      }
    }
  }, []);

  const onPointerLeave = useCallback((e) => {
    if (e.button === 0) {
      if (configRef.current.isDown) {
        e.preventDefault();
        e.stopPropagation();
        configRef.current.isDown = false;
        configRef.current.isUp = true;
      }
    }
  }, []);

  const onPointerUp = useCallback((e) => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      configRef.current.isDown = false;
      configRef.current.isUp = true;
    }
  }, []);

  return { onPointerDown, onPointerMove, onPointerLeave, onPointerUp };
};
