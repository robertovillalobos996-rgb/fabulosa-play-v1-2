import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDm83HWPhPFyZU3SDhIbMHk3MKLwySa8vc",
  authDomain: "fabulosa-play-dd135.firebaseapp.com",
  projectId: "fabulosa-play-dd135",
  storageBucket: "fabulosa-play-dd135.firebasestorage.app",
  messagingSenderId: "876569138741",
  appId: "1:876569138741:web:535132e2c8c163f728c37c",
  measurementId: "G-PM6KBHYQ7F"
};

// Encendemos la maquinaria
const app = initializeApp(firebaseConfig);

// Sacamos las herramientas a la venta para que la app las vea
export const db = getFirestore(app);
export const storage = getStorage(app);