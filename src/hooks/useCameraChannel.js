import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CAMERA_CHANNEL_DEFAULTS } from "../utils/cameraChannel";
export default function useCameraChannel() {
  const [config, setConfig] = useState(CAMERA_CHANNEL_DEFAULTS);
  const [error, setError] = useState("");
  useEffect(() => onSnapshot(doc(db, "catalog", "camera-radio-config"), (snapshot) => {
    setConfig({ ...CAMERA_CHANNEL_DEFAULTS, ...(snapshot.exists() ? snapshot.data() : {}) });
    setError("");
  }, (reason) => setError(reason.message)), []);
  return { config, error };
}
