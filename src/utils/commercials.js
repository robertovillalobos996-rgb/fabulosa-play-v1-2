import { getYouTubeVideoId } from "./media.js";

export const COMMERCIAL_INTERVAL_MS = 25 * 60 * 1000;
export const IMAGE_COMMERCIAL_SECONDS = 10;
export const IMAGE_SKIP_SECONDS = 7;
export const VIDEO_SKIP_SECONDS = 15;
export const COMMERCIAL_SESSION_KEY = "fabulosa-channel-commercials-v1";

export function isBannerVideo(banner) {
  return Boolean(getYouTubeVideoId(banner?.image)) || ["video", "youtube"].includes(banner?.mediaType) || /\.(mp4|webm|ogg)(?:\?|#|$)/i.test(banner?.image || "");
}

export function commercialQueue(banners) {
  return banners.filter((item) => item.channelAd !== false && typeof item.image === "string" && item.image.trim());
}

export function restoreCommercialClock(value) {
  return {
    elapsed: Math.min(COMMERCIAL_INTERVAL_MS, Math.max(0, Number(value?.elapsed) || 0)),
    next: Math.max(0, Math.floor(Number(value?.next) || 0)),
    lastId: typeof value?.lastId === "string" ? value.lastId : "",
  };
}

export function nextCommercial(clock, queue) {
  if (!queue.length || clock.elapsed < COMMERCIAL_INTERVAL_MS) return null;
  const lastIndex = queue.findIndex((item) => item.id === clock.lastId);
  const index = lastIndex >= 0 ? (lastIndex + 1) % queue.length : clock.next % queue.length;
  return { ...queue[index], queueIndex: index };
}

// Only count normal playback. Seeking, buffering and hidden tabs do not unlock Skip.
export function createWatchClock() {
  let watched = 0;
  let previous = null;
  return (time, playing, visible, now) => {
    const current = { time, now };
    if (previous && playing && visible) {
      const mediaDelta = time - previous.time;
      const wallDelta = (now - previous.now) / 1000;
      if (mediaDelta > 0 && mediaDelta <= wallDelta + 0.5 && wallDelta <= 1) {
        watched += Math.min(mediaDelta, wallDelta);
      }
    }
    previous = playing && visible ? current : null;
    return watched;
  };
}

export async function landscapeFullscreen(element) {
  try {
    if (!document.fullscreenElement) {
      if (!element?.requestFullscreen) return false;
      await element.requestFullscreen();
    }
    try { await window.screen.orientation?.lock?.("landscape"); } catch { /* Rotation depends on the device. */ }
    return true;
  } catch { return false; }
}
