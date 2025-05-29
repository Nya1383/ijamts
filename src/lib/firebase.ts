import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDw-raVbFjHLGGDMaNuMpTFJ5bG6_DJ80s",
  authDomain: "ijamts.firebaseapp.com",
  projectId: "ijamts",
  storageBucket: "ijamts.firebasestorage.app",
  messagingSenderId: "304504515207",
  appId: "1:304504515207:web:354a14a07c15ba5e3fe622",
  measurementId: "G-KT7G7WGKHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth }; 