import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "movie-ra.firebaseapp.com",
  projectId: "movie-ra",
  storageBucket: "movie-ra.appspot.com",
  messagingSenderId: "1012585180226",
  appId: "1:1012585180226:web:66a3cc2dd504c40e4991db",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const provider = new GoogleAuthProvider();

