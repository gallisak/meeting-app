import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4W4ZrKRb9zJ5Mppgz2msnPW_FYHmgiwk",
  authDomain: "meeting-app-bdb2e.firebaseapp.com",
  projectId: "meeting-app-bdb2e",
  storageBucket: "meeting-app-bdb2e.firebasestorage.app",
  messagingSenderId: "581795910554",
  appId: "1:581795910554:web:c6f1ef9e1ebd4a1935e023",
  measurementId: "G-8E6J0RLT8J",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
