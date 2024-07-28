// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import "./components/obsidian";
import "./components/web_ribbon";
import "./components/web_left_leaf";
import "./components/web_right_leaf";
import "./components/main_body";
// import { SetApp } from "./store";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnm0inOehg-dpwxs1se08_K4qwLd_gWQg",
  authDomain: "obsidian-family-tree.firebaseapp.com",
  projectId: "obsidian-family-tree",
  storageBucket: "obsidian-family-tree.appspot.com",
  messagingSenderId: "105313428821",
  appId: "1:105313428821:web:6d9b5718a026cf0fdd7bdc",
  measurementId: "G-N7EMM8E9W3"
};

// Initialize Firebase
const startFirestore = async () => {
  const app = initializeApp(firebaseConfig);
  initializeFirestore(app, {
    localCache: persistentLocalCache(/*settings*/ {})
  });
  // await SetApp(app);
};
document.addEventListener("DOMContentLoaded", async () => {
  await startFirestore();
});

// const registerServiceWorker = async () => {
//   if ("serviceWorker" in navigator) {
//     try {
//       const registration = await navigator.serviceWorker.register("/service-worker.js", {
//         scope: "/"
//       });
//       if (registration.installing) {
//         console.log("Service worker installing");
//       } else if (registration.waiting) {
//         console.log("Service worker installed");
//       } else if (registration.active) {
//         console.log("Service worker active");
//       }
//     } catch (error) {
//       console.error(`Registration failed with ${error}`);
//     }
//   }
// };

// // …

// registerServiceWorker();
