import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBs_F-n9ZkeEWFOv1whaWzKUj-jmZbBe1k",
    authDomain: "bunk-60e02.firebaseapp.com",
    projectId: "bunk-60e02",
    storageBucket: "bunk-60e02.firebasestorage.app",
    messagingSenderId: "418701503264",
    appId: "1:418701503264:web:06e80d836bcadd99fd0545",
    measurementId: "G-RQ7G5CH7QR"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request notification permission
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" });
    if (currentToken) {
      console.log("Token received:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
