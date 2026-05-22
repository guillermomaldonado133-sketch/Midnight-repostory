import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6TMoD6Sop0nqmagizZqRPmHi6eKifgTE",
  authDomain: "midnight-consesionario.firebaseapp.com",
  projectId: "midnight-consesionario",
  storageBucket: "midnight-consesionario.firebasestorage.app",
  messagingSenderId: "519325825634",
  appId: "1:519325825634:web:288535c094a1bde4306f3b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const auth = getAuth(app);

export default auth;