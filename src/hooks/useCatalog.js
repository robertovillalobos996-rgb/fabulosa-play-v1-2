import { useEffect, useState } from "react";
import { catalogDefaults } from "../data/site-defaults";

export default function useCatalog(key) {
  const fallback = catalogDefaults[key];
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [remote, setRemote] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;
    import("../lib/firebase")
      .then(({ subscribeCatalog }) => {
        if (!active) return;
        unsubscribe = subscribeCatalog(
          key,
          fallback,
          (next, isRemote) => {
            if (!active) return;
            setData(next);
            setRemote(isRemote);
            setLoading(false);
          },
          (reason) => {
            if (!active) return;
            setError(reason?.message || "No fue posible sincronizar el catálogo.");
            setLoading(false);
          },
        );
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason?.message || "No fue posible iniciar el catálogo.");
        setLoading(false);
      });
    return () => { active = false; unsubscribe(); };
  }, [fallback, key]);

  return { data, loading, remote, error };
}
