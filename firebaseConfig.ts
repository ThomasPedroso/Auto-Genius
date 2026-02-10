
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjyBeG1kDrf9_MITQrT9noV0Qq21ocYTk",
  authDomain: "auto-genius-937c0.firebaseapp.com",
  projectId: "auto-genius-937c0",
  storageBucket: "auto-genius-937c0.firebasestorage.app",
  messagingSenderId: "169448939448",
  appId: "1:169448939448:web:00ddb4e845552c67f0394d",
  measurementId: "G-NL3SVN14VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
