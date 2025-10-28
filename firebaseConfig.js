// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCswRsi-UvTI3KTpje-uiZmetaeLAGlPS0",
  authDomain: "financial-freedom-app-f3aea.firebaseapp.com",
  projectId: "financial-freedom-app-f3aea",
  storageBucket: "financial-freedom-app-f3aea.firebasestorage.app",
  messagingSenderId: "887606630971",
  appId: "1:887606630971:web:fd10898d4b2f0b3e9b5a1e",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

const db = getFirestore(app);

export { app, auth, db };
