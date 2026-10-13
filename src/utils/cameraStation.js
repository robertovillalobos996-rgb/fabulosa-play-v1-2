export const CAMERA_STATION_DEFAULTS = {
  enabled: true, name: "Fabulosa Radio", idMinutes: 6, voiceMinutes: 12,
  commercialMinutes: 15, commercialTimes: "", timezone: "America/Costa_Rica",
  advertisingEnabled: true, advertisingMinutes: 10,
  storageUrl: "", storageKey: "", storageBucket: "camera-radio",
};

export const CAMERA_AUDIO_KINDS = { music: "Música y mixes", id: "IDs y sellos", commercial: "Comerciales", voice: "Voces del locutor" };

export function isCameraChannel(channel) {
  if (typeof channel?.cameraSource === "boolean") return channel.cameraSource;
  return /^camaras(?:\s|$)/.test(String(channel?.genre || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase());
}

export function safeAudioUrl(value) {
  const text = String(value || "").trim();
  if (/^\/(?!\/)/.test(text)) return text;
  try { return new URL(text).protocol === "https:" ? text : ""; } catch { return ""; }
}

export function stationMinutes(value, fallback) {
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes >= 0 ? minutes : fallback;
}

export function stationClock(now, timezone = "America/Costa_Rica") {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(now));
  const p = Object.fromEntries(parts.map((item) => [item.type, item.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

export function commercialIsEligible(track, now, timezone) {
  const time = stationClock(now, timezone).time;
  const start = /^\d{2}:\d{2}$/.test(track.startTime || "") ? track.startTime : "00:00";
  const end = /^\d{2}:\d{2}$/.test(track.endTime || "") ? track.endTime : "23:59";
  return start <= end ? time >= start && time <= end : time >= start || time <= end;
}

// One shuffle bag per kind: every song plays before a bag is shuffled again.
// Inserts are queued only at track boundaries, so a mix is never cut in half.
export function createCameraRadioPlanner(initialTracks = [], initialConfig = {}, random = Math.random, startAt = Date.now()) {
  let tracks = [], config = {}, pending = [];
  const bags = new Map(), last = new Map(), firedTimes = new Set(), rejected = new Set();
  let lastId = startAt, lastVoice = startAt, lastCommercial = startAt, previousBoundary = startAt;
  function update(nextTracks, nextConfig) {
    tracks = nextTracks.filter((track) => !rejected.has(track.id) && track.enabled !== false && CAMERA_AUDIO_KINDS[track.kind] && safeAudioUrl(track.url));
    config = { ...CAMERA_STATION_DEFAULTS, ...nextConfig };
    for (const [kind, bag] of bags) bags.set(kind, bag.filter((id) => tracks.some((t) => t.id === id && t.kind === kind)));
    pending = pending.filter((entry) => tracks.some((t) => t.id === entry.id));
  }
  function pick(kind) {
    const available = tracks.filter((track) => track.kind === kind);
    if (!available.length) return null;
    let bag = bags.get(kind) || [];
    if (!bag.length) {
      bag = available.map((track) => track.id);
      for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
      if (bag.length > 1 && bag[0] === last.get(kind)) [bag[0], bag[1]] = [bag[1], bag[0]];
    }
    const id = bag.shift(); bags.set(kind, bag); last.set(kind, id);
    return available.find((track) => track.id === id) || null;
  }
  function due(minutes, previous, now) { return minutes > 0 && now - previous >= minutes * 60000; }
  function next(now = Date.now()) {
    if (pending.length) return pending.shift();
    const clock = stationClock(now, config.timezone);
    for (const key of firedTimes) if (!key.startsWith(clock.day + "/")) firedTimes.delete(key);
    const requestedTimes = String(config.commercialTimes || "").split(/[\s,;]+/).filter((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time));
    const timeSlots = requestedTimes.filter((time) => {
      const key = `${clock.day}/${time}`;
      // Only slots crossed while listening are due; opening at night does not replay the morning.
      const previous = stationClock(previousBoundary, config.timezone);
      return !firedTimes.has(key) && time <= clock.time && (previous.day !== clock.day || time > previous.time);
    });
    previousBoundary = now;
    const ads = tracks.filter((track) => track.kind === "commercial" && commercialIsEligible(track, now, config.timezone));
    if (ads.length && (timeSlots.length || due(stationMinutes(config.commercialMinutes, 15), lastCommercial, now))) {
      const stamp = pick("id");
      if (stamp) {
        lastId = now; lastCommercial = now;
        timeSlots.forEach((time) => firedTimes.add(`${clock.day}/${time}`));
        // Stable order from the panel, preceded by one station ID on every block.
        pending = [...ads].sort((a, b) => (a.order || 0) - (b.order || 0) || a.id.localeCompare(b.id));
        return { ...stamp, commercialIntro: true };
      }
    }
    if (due(stationMinutes(config.idMinutes, 6), lastId, now)) {
      const stamp = pick("id"); if (stamp) { lastId = now; return stamp; }
    }
    if (due(stationMinutes(config.voiceMinutes, 12), lastVoice, now)) {
      const voice = pick("voice"); if (voice) { lastVoice = now; return voice; }
    }
    return pick("music");
  }
  update(initialTracks, initialConfig);
  function reject(track) {
    rejected.add(track?.id);
    tracks = tracks.filter((item) => item.id !== track?.id);
    if (track?.commercialIntro) pending = [];
    for (const [kind, bag] of bags) bags.set(kind, bag.filter((id) => id !== track?.id));
  }
  return { next, update, reject };
}
