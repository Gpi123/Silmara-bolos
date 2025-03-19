import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvuEJhrA4SUTIB-1p_f7nu2PfxUO5aTIg",
  authDomain: "silmara-bolos.firebaseapp.com",
  projectId: "silmara-bolos",
  storageBucket: "silmara-bolos.firebasestorage.app",
  messagingSenderId: "338397346081",
  appId: "1:338397346081:web:f02ff76b4bf9a59db66660",
  measurementId: "G-N3SRQKCTZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

console.log("Firebase Storage configurado! Bucket:", firebaseConfig.storageBucket);

export { app, db, storage, auth }; 