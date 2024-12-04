import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbnmu0RyE32dnaJf1Oo2KsVRxugRPhAtE",
  authDomain: "otpfirebaseproject-70f8b.firebaseapp.com",
  databaseURL: "https://otpfirebaseproject-70f8b.firebaseio.com",
  projectId: "otpfirebaseproject-70f8b",
  storageBucket: "otpfirebaseproject-70f8b.appspot.com",
  messagingSenderId: "376076841719",
  appId: "1:376076841719:web:5fd83c4d4ff214122ad9f2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
