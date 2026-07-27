import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB-DQ4AMXkxQ3BmwRiUHJa-ZRBcGH5njZE",
  authDomain: "learn-streak.firebaseapp.com",
  projectId: "learn-streak",
  storageBucket: "learn-streak.firebasestorage.app",
  messagingSenderId: "56028259647",
  appId: "1:56028259647:web:dc3d0ebbedbcffb7871f8a",
  measurementId: "G-3MS7WBHT86",
  databaseURL: "https://learn-streak-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
