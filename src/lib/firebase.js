import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkj3iZAHP3KsRlMqDFoJVukrObkiTPhzc",
  authDomain: "fabulosaplaycr.firebaseapp.com",
  projectId: "fabulosaplaycr",
  storageBucket: "fabulosaplaycr.firebasestorage.app",
  messagingSenderId: "584319993672",
  appId: "1:584319993672:web:6722f653502dcc7bc6957d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function subscribeCatalog(key, fallback, onValue, onError) {
  return onSnapshot(
    doc(db, "catalog", key),
    (snapshot) => {
      if (!snapshot.exists()) return onValue(fallback, false);
      const data = snapshot.data();
      onValue(key === "settings" ? { ...fallback, ...data } : (Array.isArray(data.items) ? data.items : fallback), true);
    },
    (error) => {
      onValue(fallback, false);
      onError?.(error);
    },
  );
}

export async function saveCatalog(key, value) {
  const payload = key === "settings" ? value : { items: value };
  await setDoc(doc(db, "catalog", key), { ...payload, updatedAt: serverTimestamp() });
}
