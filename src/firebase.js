
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC3kAq5i9CR8J9JOeAf_QL9k-TJggn2siU",
  authDomain: "skillup-4ab88.firebaseapp.com",
  projectId: "skillup-4ab88",
  storageBucket: "skillup-4ab88.firebasestorage.app",
  messagingSenderId: "260987138891",
  appId: "1:260987138891:web:22a4a369f1f68de6c92ece",
  measurementId: "G-PEBGB3ST7W"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
