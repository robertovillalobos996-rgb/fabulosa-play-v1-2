import { useEffect, useRef } from "react";
import { getApp } from "firebase/app";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { auth } from "../lib/firebase";
import { ensureAudienceUser } from "./useLiveAudience";
import { audienceProfile, costaRicaDay } from "../utils/audienceVisits";
function visitSession(now) {
  try {
    const saved = JSON.parse(sessionStorage.getItem("fabulosa-visit") || "null");
    const id = saved && now - saved.last < 1800000 && /^[a-f0-9-]{36}$/.test(saved.id) ? saved.id : crypto.randomUUID();
    sessionStorage.setItem("fabulosa-visit", JSON.stringify({ id, last: now }));
    return id;
  } catch { return crypto.randomUUID(); }
}
async function createOnce(reference, data) {
  if ((await getDoc(reference)).exists()) return;
  try { await setDoc(reference, data); }
  catch (error) { if (error.code !== "permission-denied" || !(await getDoc(reference)).exists()) throw error; }
}
export default function useSiteVisits() {
  const completed = useRef(new Set());
  useEffect(() => {
    let active = true, busy = false;
    const record = async () => {
      if (!active || busy || document.hidden || navigator.onLine === false) return;
      busy = true;
      try {
        await auth.authStateReady();
        if (auth.currentUser?.email?.toLowerCase() === "fabulosaplay@gmail.com") return;
        const user = await ensureAudienceUser(), profile = await audienceProfile();
        if (!active) return;
        const now = Date.now() + profile.offset, day = costaRicaDay(now), session = visitSession(now);
        const key = `${user.uid}_${day.key}_${session}`;
        if (completed.current.has(key)) return;
        const db = getFirestore(getApp("audience"));
        const data = { owner: user.uid, dayStart: Timestamp.fromMillis(day.start), country: profile.country, createdAt: serverTimestamp() };
        await createOnce(doc(db, "audienceDaily", `${user.uid}_${day.key}`), data);
        if (!active) return;
        await createOnce(doc(db, "audienceVisits", key), data);
        completed.current.add(key);
      } catch (error) { console.debug("Visita no registrada:", error.code || "sin conexión"); }
      finally { busy = false; }
    };
    record(); const timer = setInterval(record, 60000);
    document.addEventListener("visibilitychange", record);
    return () => { active = false; clearInterval(timer); document.removeEventListener("visibilitychange", record); };
  }, []);
}
