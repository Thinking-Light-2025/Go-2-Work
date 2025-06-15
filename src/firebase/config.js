// config.js

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDfQd3F0pj7yf51iPKekk0YGey53QwMXB4",
  authDomain: "projeto-3-4c7ce.firebaseapp.com",
  projectId: "projeto-3-4c7ce",
  storageBucket: "projeto-3-4c7ce.firebasestorage.app",
  messagingSenderId: "692191144426",
  appId: "1:692191144426:web:e9c3b475585ccb17deea93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, db, auth };
