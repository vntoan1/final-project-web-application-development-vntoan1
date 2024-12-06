// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyC7QcKWHG3qGfYRMOoCXfltWI7qmumMYkU",
  authDomain: "quanly-26dbf.firebaseapp.com",
  databaseURL: "https://quanly-26dbf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quanly-26dbf",
  storageBucket: "quanly-26dbf.firebasestorage.app",
  messagingSenderId: "345970970909",
  appId: "1:345970970909:web:341c4f5416de805c1911f4",
  measurementId: "G-G6RPTE0T2H"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication và Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);  // Khởi tạo Firestore

// Export các đối tượng Firebase
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, firestore };
