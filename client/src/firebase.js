// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "market-place-1e60d.firebaseapp.com",
  projectId: "market-place-1e60d",
  storageBucket: "market-place-1e60d.firebasestorage.app",
  messagingSenderId: "427400355489",
  appId: "1:427400355489:web:883f781976dc55cefadae0",
  measurementId: "G-71C2P471H9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
