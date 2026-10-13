import { useEffect, useState } from "react";
import { collection, doc, documentId, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CAMERA_STATION_DEFAULTS } from "../utils/cameraStation";

export default function useCameraStation() {
  const [config, setConfig] = useState(CAMERA_STATION_DEFAULTS);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let configReady = false, tracksReady = false;
    const ready = () => setLoading(!(configReady && tracksReady));
    const failure = (reason) => { setError(reason.message || "No se pudo cargar la emisora."); setLoading(false); };
    const stopConfig = onSnapshot(doc(db, "catalog", "camera-radio-config"), (snapshot) => {
      setConfig({ ...CAMERA_STATION_DEFAULTS, ...(snapshot.exists() ? snapshot.data() : {}) }); configReady = true; ready();
    }, failure);
    const stopTracks = onSnapshot(query(collection(db, "catalog"), where(documentId(), ">=", "camera-radio-track-"), where(documentId(), "<=", "camera-radio-track-\uf8ff")), (snapshot) => {
      setTracks(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })).sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.title || "").localeCompare(String(b.title || ""))));
      tracksReady = true; ready();
    }, failure);
    return () => { stopConfig(); stopTracks(); };
  }, []);
  return { config, tracks, loading, error };
}
