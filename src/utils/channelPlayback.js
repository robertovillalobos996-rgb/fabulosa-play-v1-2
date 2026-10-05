import { getChannelSource } from "./channelMedia";

let enginePromise;
const connections = new Map();

export function isProviderChannel(channel) {
  return ["tv-7-teletica", "tv-13-sinart"].includes(channel?.id);
}

export function loadChannelEngine() {
  enginePromise ||= import("hls.js").then((module) => module.default).catch((error) => { enginePromise = null; throw error; });
  return enginePromise;
}

export function prepareChannelPlayback(channel) {
  if (isProviderChannel(channel)) return;
  const source = getChannelSource(channel);
  if (source.type !== "hls" && source.type !== "video") return;
  if (source.type === "hls") loadChannelEngine().catch(() => {});
  try {
    const origin = new URL(source.src, window.location.origin).origin;
    if (origin === window.location.origin || connections.has(origin)) return;
    const link = document.createElement("link");
    link.rel = "preconnect"; link.href = origin; link.crossOrigin = "anonymous";
    document.head.appendChild(link); connections.set(origin, link);
    if (connections.size > 3) { const oldest = connections.keys().next().value; connections.get(oldest).remove(); connections.delete(oldest); }
  } catch { /* Invalid sources are handled by the player. */ }
}

function playlistPolicy() {
  return { default: {
    maxTimeToFirstByteMs: 6000, maxLoadTimeMs: 12000,
    timeoutRetry: { maxNumRetry: 1, retryDelayMs: 300, maxRetryDelayMs: 1500, backoff: "exponential" },
    errorRetry: { maxNumRetry: 2, retryDelayMs: 300, maxRetryDelayMs: 1500, backoff: "exponential" },
  } };
}

export function channelEngineConfig() {
  return {
    enableWorker: true, lowLatencyMode: true, startLevel: 0, testBandwidth: false,
    startFragPrefetch: true, capLevelToPlayerSize: true,
    maxBufferLength: 12, maxMaxBufferLength: 30, backBufferLength: 12, maxBufferSize: 16 * 1024 * 1024,
    liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 8, maxLiveSyncPlaybackRate: 1.1,
    manifestLoadPolicy: playlistPolicy(), playlistLoadPolicy: playlistPolicy(),
  };
}
