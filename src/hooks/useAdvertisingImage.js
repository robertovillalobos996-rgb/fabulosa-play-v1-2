import { useEffect, useState } from "react";
import { isStoredAdvertisingImage, loadAdvertisingImage } from "../utils/advertisingImages";

export default function useAdvertisingImage(value = "") {
  const [result, setResult] = useState({ value: "", source: "", error: "" });
  const stored = isStoredAdvertisingImage(value);
  useEffect(() => {
    if (!stored) return undefined;
    let active = true;
    loadAdvertisingImage(value).then((source) => {
      if (active) setResult({ value, source, error: "" });
    }).catch((reason) => {
      if (active) setResult({ value, source: "", error: reason.message });
    });
    return () => { active = false; };
  }, [stored, value]);
  if (!stored) return { source: value, error: "" };
  return result.value === value ? result : { source: "", error: "" };
}
