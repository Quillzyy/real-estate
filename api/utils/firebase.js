// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "fabled-orbit-437405-u7.firebaseapp.com",
    projectId: "fabled-orbit-437405-u7",
    storageBucket: "fabled-orbit-437405-u7.firebasestorage.app",
    messagingSenderId: "757769906052",
    appId: "1:757769906052:web:d1f78611cb25db3db79fd1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, "users");

console.log("Firebase initialized!");

export { app, db, usersCollection };
