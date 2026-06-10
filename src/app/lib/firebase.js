import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAfbb2lYgouH0VtE3tz2poQJhbaBeCjGgM",
  authDomain: "thapello-ai.firebaseapp.com",
  projectId: "thapello-ai",
  storageBucket: "thapello-ai.firebasestorage.app",
  messagingSenderId: "1020163888499",
  appId: "1:1020163888499:web:8d71c0536dd52af0a02106",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export default app;
