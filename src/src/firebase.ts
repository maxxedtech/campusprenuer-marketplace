// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHNxf-GFW8G-4GvcCYQ9JeDT_STa1Zv9Y",
  authDomain: "campusprenuer-4a36b.firebaseapp.com",
  projectId: "campusprenuer-4a36b",
  storageBucket: "campusprenuer-4a36b.firebasestorage.app",
  messagingSenderId: "678248714267",
  appId: "1:678248714267:web:fcea748fce992fe33ca8be",
  measurementId: "G-Z28M3T22KN",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
