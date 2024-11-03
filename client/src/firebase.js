// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "fabled-orbit-437405-u7.firebaseapp.com",
    projectId: "fabled-orbit-437405-u7",
    storageBucket: "fabled-orbit-437405-u7.firebasestorage.app",
    messagingSenderId: "757769906052",
    appId: "1:757769906052:web:5952a70fcf28f171b79fd1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
