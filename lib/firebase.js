// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// Analytics should only be imported and used on the client side
let analytics = null;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Analytics only on client side
if (typeof window !== 'undefined') {
  // Import analytics only on client side
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(error => {
    console.error('Analytics failed to load:', error);
  });
}

export { db, storage, auth, analytics };