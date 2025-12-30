// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuH72sE8X4KpqjNjHwrCX2ssjHEJvtfiQ",

  authDomain: "m3m-crown-f7f88.firebaseapp.com",

  databaseURL:
    "https://m3m-crown-f7f88-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "m3m-crown-f7f88",

  storageBucket: "m3m-crown-f7f88.appspot.com",

  messagingSenderId: "23174261304",

  appId: "1:23174261304:web:ab1bde4855a87fba3b54cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
