// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Cấu hình Firebase
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

// Xuất Firestore
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore , auth };
