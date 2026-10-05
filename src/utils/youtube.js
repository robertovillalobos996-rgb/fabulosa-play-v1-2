let apiPromise;

export function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    const timeout = window.setTimeout(() => fail(), 15000);
    function fail() {
      window.clearTimeout(timeout);
      script?.remove();
      window.onYouTubeIframeAPIReady = previousReady;
      apiPromise = undefined;
      reject(new Error("No fue posible cargar el reproductor de YouTube."));
    }
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      try { previousReady?.(); } finally { resolve(window.YT); }
    };
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("error", fail, { once: true });
  });
  return apiPromise;
}
