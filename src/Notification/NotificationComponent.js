import React, { useEffect } from 'react';
import {
  subscribeToPush,
  registerServiceWorker,
  unsubscribeFromPush,
  notifyMe,
} from './push-notification';

function NotificationComponent() {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          subscribeToPush();
        }
      });
    } else if (Notification.permission === 'granted') {
      subscribeToPush();
    }

    // Call updateUI after component mounts
    // updateUI();
  }, []);

  return (
    <>
      {/* <div>
      <button id="register" onClick={registerServiceWorker}>
        Register Service Worker
      </button>
      <button id="unregister" onClick={unsubscribeFromPush}>
        Unsubscribe from Push
      </button>
      <button id="subscribe" onClick={subscribeToPush}>
        Subscribe to Push
      </button>
      <button id="notify-me" onClick={notifyMe}>
        Notify Me
      </button>
    </div> */}
    </>
  );
}

export default NotificationComponent;
