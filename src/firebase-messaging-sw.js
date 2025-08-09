// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Firebase config — must match your .env values
firebase.initializeApp({
  apiKey: "AIzaSyBs_F-n9ZkeEWFOv1whaWzKUj-jmZbBe1k",
  authDomain: "bunk-60e02.firebaseapp.com",
  projectId: "bunk-60e02",
  storageBucket: "bunk-60e02.firebasestorage.app",
  messagingSenderId: "418701503264",
  appId: "1:418701503264:web:06e80d836bcadd99fd0545"
});

const messaging = firebase.messaging();

// Optional: Listen for background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background Message Received", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"
  });
});
