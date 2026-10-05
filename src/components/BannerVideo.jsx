import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getYouTubeVideoId } from "../utils/media";
import { createWatchClock } from "../utils/commercials";
import { loadYouTubeApi } from "../utils/youtube";

export default function BannerVideo({ source, muted = true, autoPlay = true, loop = false, onEnded, onError, onProgress, onStatus, className = "" }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const options = useRef({ muted, autoPlay, onEnded, onError, onProgress, onStatus });
  const [needsPlay, setNeedsPlay] = useState(!autoPlay);
  const videoId = getYouTubeVideoId(source);

  useEffect(() => { options.current = { muted, autoPlay, onEnded, onError, onProgress, onStatus }; }, [muted, autoPlay, onEnded, onError, onProgress, onStatus]);

  useEffect(() => {
    setNeedsPlay(!options.current.autoPlay);
    let active = true;
    let poll;
    const watchClock = createWatchClock();
    const status = (value) => { if (active) options.current.onStatus?.(value); };
    const blocked = () => { if (active) { setNeedsPlay(true); status("blocked"); } };
    const fail = () => { if (active) { status("error"); options.current.onError?.(); } };
    let visibilityHandler;
    if (videoId) {
      const container = containerRef.current;
      const target = document.createElement("div");
      container.replaceChildren(target);
      loadYouTubeApi().then((YT) => {
        if (!active) return;
        let ready = false;
        let started = false;
        let readyAt = 0;
        const player = new YT.Player(target, {
          videoId,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, playsinline: 1, rel: 0, origin: window.location.origin },
          events: {
            onReady: (event) => {
              if (!active) return;
              ready = true;
              readyAt = performance.now();
              event.target.getIframe().setAttribute("allow", "autoplay; encrypted-media; fullscreen");
              event.target.getIframe().setAttribute("title", "Video publicitario");
              if (options.current.muted) event.target.mute(); else event.target.unMute();
              if (options.current.autoPlay) event.target.playVideo(); else blocked();
            },
            onStateChange: (event) => {
              if (!active) return;
              if (event.data === YT.PlayerState.PLAYING) { started = true; setNeedsPlay(false); status("playing"); }
              else if (event.data === YT.PlayerState.ENDED) {
                status("ended");
                if (loop) { event.target.seekTo(0); event.target.playVideo(); }
                else options.current.onEnded?.();
              } else if (event.data === YT.PlayerState.PAUSED) { status("paused"); blocked(); }
              else status("loading");
            },
            onAutoplayBlocked: blocked,
            onError: fail,
          },
        });
        playerRef.current = player;
        poll = window.setInterval(() => {
          if (!active || !ready) return;
          const playing = player.getPlayerState() === YT.PlayerState.PLAYING;
          options.current.onProgress?.(watchClock(player.getCurrentTime(), playing, !document.hidden, performance.now()));
          if (!started && options.current.autoPlay && performance.now() - readyAt > 3000) blocked();
        }, 250);
        let resumeOnVisible = false;
        visibilityHandler = () => {
          if (document.hidden) { resumeOnVisible = player.getPlayerState() === YT.PlayerState.PLAYING; if (resumeOnVisible) player.pauseVideo(); }
          else if (resumeOnVisible) { resumeOnVisible = false; player.playVideo(); }
        };
        document.addEventListener("visibilitychange", visibilityHandler);
      }).catch(fail);
    } else {
      const video = videoRef.current;
      if (options.current.autoPlay) video.play().catch((reason) => { if (reason.name === "NotAllowedError") blocked(); else if (reason.name !== "AbortError") fail(); });
      poll = window.setInterval(() => options.current.onProgress?.(watchClock(video.currentTime, !video.paused && !video.ended && video.readyState >= 3, !document.hidden, performance.now())), 250);
      let resumeOnVisible = false;
      visibilityHandler = () => {
        if (document.hidden) { resumeOnVisible = !video.paused; video.pause(); }
        else if (resumeOnVisible) { resumeOnVisible = false; video.play().catch(blocked); }
      };
      document.addEventListener("visibilitychange", visibilityHandler);
    }
    return () => {
      active = false;
      window.clearInterval(poll);
      if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId, source, loop]);

  useEffect(() => {
    const player = playerRef.current;
    if (player?.mute) { if (muted) player.mute(); else player.unMute(); }
  }, [muted]);

  function play() {
    if (playerRef.current?.playVideo) { playerRef.current.playVideo(); }
    else videoRef.current?.play().catch(() => setNeedsPlay(true));
  }

  return (
    <div className={`relative bg-black ${className}`}>
      {videoId ? <div ref={containerRef} className="media-youtube h-full w-full" /> : <video ref={videoRef} src={source} muted={muted} playsInline preload="auto" loop={loop} onEnded={() => options.current.onEnded?.()} onError={() => options.current.onError?.()} onPlaying={() => { setNeedsPlay(false); options.current.onStatus?.("playing"); }} onPause={() => { setNeedsPlay(true); options.current.onStatus?.("paused"); }} className="h-full w-full object-contain" />}
      {needsPlay && <button type="button" onClick={play} className="focus-ring absolute left-1/2 top-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950"><Play size={18} fill="currentColor" /> Reproducir video</button>}
    </div>
  );
}
