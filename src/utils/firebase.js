// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO : Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs0vADqY-7chXCOa46BdzpSZWbwoLd7_4",
  authDomain: "useful-sunup-329315.firebaseapp.com",
  projectId: "useful-sunup-329315",
  storageBucket: "useful-sunup-329315.appspot.com",
  messagingSenderId: "1008367810267",
  appId: "1:1008367810267:web:42a9425d7132b129907efe",
  measurementId: "G-PR6ZCWMY80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();