// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDERHE4Bwgcjtlqm3u2T9A8Jpg72JTphuA",
  authDomain: "auraconsultapp.firebaseapp.com",
  projectId: "auraconsultapp",
  storageBucket: "auraconsultapp.firebasestorage.app",
  messagingSenderId: "340125028716",
  appId: "1:340125028716:web:54cfc216217028a9aaa349"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Export Firebase auth functions for convenience
export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
};