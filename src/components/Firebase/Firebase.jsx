import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//TODO
// move these credntials to .env

const firebaseConfig = {
  apiKey: "AIzaSyAwjxOpR3-W6lNWwi1fwFNlKkSjQQOpo-U",
  authDomain: "tiny-ecom-b297a.firebaseapp.com",
  projectId: "tiny-ecom-b297a",
  storageBucket: "tiny-ecom-b297a.firebasestorage.app",
  messagingSenderId: "652733890330",
  appId: "1:652733890330:web:cc976e8b0dc8511f6176a3",
  measurementId: "G-TG2RR60JXB",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
