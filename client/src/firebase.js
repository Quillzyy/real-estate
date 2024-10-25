// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-project-727.firebaseapp.com",
    projectId: "real-estate-project-727",
    storageBucket: "real-estate-project-727.appspot.com",
    messagingSenderId: "827512532521",
    appId: "1:827512532521:web:83b98190b3747490edf638",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
