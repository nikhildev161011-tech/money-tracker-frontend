// File: src/firebase.js
// Description: Firebase initialization configuration

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwaqFr7c0FdNbvzYPFuLGGq8F0snVxKGk",
  authDomain: "money-tracker-a604d.firebaseapp.com",
  projectId: "money-tracker-a604d",
  storageBucket: "money-tracker-a604d.firebasestorage.app",
  messagingSenderId: "197832948593",
  appId: "1:197832948593:web:9a24e05fa28fd2a41d54d0",
  measurementId: "G-XL55TEJNCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();