import { useEffect, useRef } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { deleteDoc, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { audienceProfile } from "../utils/audienceVisits";
import { auth } from "../lib/firebase";
let guestPromise;
export async function ensureAudienceUser() {
  if (!guestPromise) guestPromise = (async () => {
    const app = getApps().find((item) => item.name === "audience") || initializeApp(getApp().options, "audience");
    const guest = getAuth(app);
    await guest.authStateReady();
    return guest.currentUser || (await signInAnonymously(guest)).user;
  })().catch((error) => { guestPromise = undefined; throw error; });
  return guestPromise;
}
// This hook records a tab session, never an identified person or an IP address.
export default function useLiveAudience(value) {
  const current = useRef(value);
  current.current = value;
  const session = useRef(crypto.randomUUID());
  const channel = value?.channelId ? `${value.kind || "tv"}:${value.channelId}` : "";
  useEffect(() => {
    if (!channel || auth.currentUser?.email?.toLowerCase() === "fabulosaplay@gmail.com") return undefined;
    let active = true, reference, busy = false;
    const send = async () => {
      if (busy || !active) return;
      busy = true;
      try {
        await auth.authStateReady();
        if (auth.currentUser?.email?.toLowerCase() === "fabulosaplay@gmail.com") return;
        const user = await ensureAudienceUser();
        const profile = await audienceProfile();
        if (!active) return;
        // Use the guest app's Firestore instance so the write carries its own token.
        reference = doc(getFirestore(getApp("audience")), "liveAudience", `${user.uid}_${session.current}`);
        const data = current.current;
        if (!data || `${data.kind || "tv"}:${data.channelId}` !== channel) return;
        await setDoc(reference, {
          owner: user.uid, kind: data.kind || "tv", country: profile.country, channelId: String(data.channelId).slice(0, 160),
          channelName: String(data.channelName || "Canal").slice(0, 160), camera: Boolean(data.camera),
          cameraName: String(data.cameraName || "").slice(0, 160),
          videoPlaying: Boolean(data.videoPlaying), audioPlaying: Boolean(data.audioPlaying),
          verified: Boolean(data.verified), visible: !document.hidden, lastSeen: serverTimestamp(),
        });
        if (!active) deleteDoc(reference).catch(() => {});
      } catch (error) { console.debug("Audiencia no registrada:", error.code || "sin conexión"); }
      finally { busy = false; }
    };
    send(); const timer = setInterval(send, 30000);
    const visible = () => { send(); };
    document.addEventListener("visibilitychange", visible);
    return () => {
      active = false; clearInterval(timer); document.removeEventListener("visibilitychange", visible);
      if (reference) deleteDoc(reference).catch(() => {});
    };
  }, [channel]);
  // Status changes are reflected on the next heartbeat, at most 30 seconds later.
}
