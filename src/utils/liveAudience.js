export const AUDIENCE_TIMEOUT = 90000;
export function summarizeAudience(records, now = Date.now()) {
  const active = records.filter((item) => {
    const seen = item.lastSeen?.toMillis?.() ?? Number(item.lastSeen);
    return Number.isFinite(seen) && seen <= now + 5000 && seen >= now - AUDIENCE_TIMEOUT;
  });
  const groups = new Map();
  for (const item of active) {
    const kind = item.kind || "tv";
    const id = item.camera ? "tv:fabulosa-camera-channel" : `${kind}:${item.channelId}`;
    if (!groups.has(id)) groups.set(id, { id, kind, name: item.channelName, camera: item.camera, connected: 0, watching: 0, listening: 0, unverified: 0, sources: {} });
    const group = groups.get(id);
    group.connected++; group.watching += Number(Boolean(item.videoPlaying && item.visible && item.verified));
    group.listening += Number(Boolean(item.audioPlaying)); group.unverified += Number(!item.verified);
    if (item.cameraName) group.sources[item.cameraName] = (group.sources[item.cameraName] || 0) + 1;
  }
  const rows = [...groups.values()].sort((a, b) => Number(b.camera) - Number(a.camera) || b.connected - a.connected);
  return { rows, total: active.length, cameras: rows.filter((item) => item.camera).reduce((n, item) => n + item.connected, 0), listeners: rows.filter((item) => item.camera).reduce((n, item) => n + item.listening, 0) };
}
