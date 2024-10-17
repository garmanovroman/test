import axios from 'axios';
const VAPID_PUBLIC_KEY =
  'BOyFjA9NR-Bf9lSB_T9EOqAMZ_pwMLZEwGC9QPBD8AQgGCeR3QUcKFRihphzsC9bzrFiAYZr2wOgy4SlIiFhok4';

// Register the service worker
export async function registerServiceWorker() {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      updateUI(); // Make sure UI is updated only after registration is complete
    } else {
      console.error('Service Worker or Push is not supported in this browser.');
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

// Make sure you check registration status before calling getRegistration()
export async function subscribeToPush() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Service Worker registration not found. Please register it first.');
      return;
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('New subscription:', newSubscription);

    // Perform the POST request with axios
    axios
      .post('https://api.system123.ru/api/PushSubscription/AddPushSubscription', newSubscription, {
        withCredentials: true,
      })
      .then((response) => {
        console.log('Data successfully posted to server:', response.data);
      })
      .catch((error) => {
        console.error('Error posting data to server:', error);
      });

    updateUI();
  } catch (error) {
    console.error('Subscription to push failed:', error);
  }
}

// Unsubscribe from push notifications
// Unsubscribe from push notifications
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Service Worker registration not found');
      return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      console.log('Unsubscribed from push:', subscription);

      // Use DELETE method to remove the subscription on the server
      const deleteUrl = `https://api.system123.ru/api/PushSubscription/RemovePushSubscription/${endpoint}`;
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Subscription removed from server:', endpoint);
      //   updateUI();
    } else {
      console.log('No subscription found');
    }
  } catch (error) {
    console.error('Unsubscription from push failed:', error);
  }
}

// Notify the server for push notifications
export async function notifyMe() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Service Worker registration not found');
      return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log('Notify server about push notification');
      postToServer('/notify-me', { endpoint: subscription.endpoint });
    } else {
      console.error('No subscription found');
    }
  } catch (error) {
    console.error('Error notifying server:', error);
  }
}

// Update the UI based on the push subscription status
// Update the UI based on the push subscription status
function updateUI() {
  const registrationButton = document.getElementById('register');
  const unregistrationButton = document.getElementById('unregister');
  const subscriptionButton = document.getElementById('subscribe');
  const unsubscriptionButton = document.getElementById('unsubscribe');
  const notifyMeButton = document.getElementById('notify-me');

  // Check if the buttons exist before trying to modify them
  if (registrationButton) registrationButton.disabled = true;
  if (unregistrationButton) unregistrationButton.disabled = true;
  if (subscriptionButton) subscriptionButton.disabled = true;
  if (unsubscriptionButton) unsubscriptionButton.disabled = true;
  if (notifyMeButton) notifyMeButton.disabled = true;

  navigator.serviceWorker
    .getRegistration()
    .then((registration) => {
      if (!registration) {
        if (registrationButton) registrationButton.disabled = false;
      } else {
        if (unregistrationButton) unregistrationButton.disabled = false;

        // Handle pushManager subscription correctly
        registration.pushManager
          .getSubscription()
          .then((subscription) => {
            if (!subscription) {
              if (subscriptionButton) subscriptionButton.disabled = false;
            } else {
              if (unsubscriptionButton) unsubscriptionButton.disabled = false;
              if (notifyMeButton) notifyMeButton.disabled = false;
            }
          })
          .catch((error) => {
            console.error('Error getting push subscription:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error getting service worker registration:', error);
    });
}

// Utility function to convert Base64 to Uint8Array
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Post the data to the server
const postToServer = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Data successfully posted to server:', data);
  } catch (error) {
    console.error('Error posting data to server:', error);
  }
};
