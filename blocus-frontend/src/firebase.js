import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEN5OPPnQweGGdn2_2BO26OF_Wy-FBqvg",
  authDomain: "blocuszen.firebaseapp.com",
  projectId: "blocuszen",
  storageBucket: "blocuszen.firebasestorage.app",
  messagingSenderId: "641010752084",
  appId: "1:641010752084:web:6102aee082463692242bc1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app); // ajout pour le stockage
