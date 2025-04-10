// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyBnb50ijZT-wnUN5hzEyd8MG4Xo8e5IG5s",
    authDomain: "uretimplanlama-4b078.firebaseapp.com",
    projectId: "uretimplanlama-4b078",
    storageBucket: "uretimplanlama-4b078.firebasestorage.app",
    messagingSenderId: "623757399418",
    appId: "1:623757399418:web:719e92071457de191fb2c3"
  };

  export const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app)
  export const storage = getStorage(app);