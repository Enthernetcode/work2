// firebase-config.js

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI8rU3MKf-76fcLj4-mdJnBoA_HFaDj2A",
  authDomain: "work-77c5d.firebaseapp.com",
  databaseURL: "https://work-77c5d-default-rtdb.firebaseio.com",
  projectId: "work-77c5d",
  storageBucket: "work-77c5d.appspot.com",
  messagingSenderId: "950024593965",
  appId: "1:950024593965:web:0667c56ec6dc6a03928ea4",
  measurementId: "G-1893NX25N6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
const auth = firebase.auth();
const db = firebase.database();

export { auth, db };
