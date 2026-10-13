const DAY = 86400000;
export function costaRicaDay(now = Date.now()) {
  const shifted = new Date(now - 6 * 3600000);
  const key = shifted.toISOString().slice(0, 10);
  return { key, start: Date.parse(`${key}T06:00:00.000Z`) };
}
export function reportDays(days, now = Date.now()) {
  const start = costaRicaDay(now).start;
  return Array.from({ length: days }, (_, index) => costaRicaDay(start - (days - index - 1) * DAY));
}
export function countryName(code) {
  if (!code || code === "ZZ") return "País no disponible";
  try { return new Intl.DisplayNames(["es"], { type: "region" }).of(code); } catch { return code; }
}
let profilePromise;
export function audienceProfile() {
  if (!profilePromise) profilePromise = fetch("/api/audience-country", { cache: "no-store" }).then(async (response) => {
    if (!response.ok) throw new Error("País no disponible");
    const data = await response.json();
    return { country: /^[A-Z]{2}$/.test(data.country) ? data.country : "ZZ", offset: Number.isFinite(data.now) ? data.now - Date.now() : 0 };
  }).catch(() => { profilePromise = undefined; return { country: "ZZ", offset: 0 }; });
  return profilePromise;
}
export function summarizeVisits(daily, entries, days = 7, now = Date.now()) {
  const dates = reportDays(days, now), keys = new Set(dates.map((item) => item.key));
  const users = new Set(), today = new Set(), byDay = new Map(dates.map((item) => [item.key, { day: item.key, users: new Set(), entries: 0 }])), countries = new Map(), userCountries = new Map();
  for (const item of daily) {
    const time = item.dayStart?.toMillis?.() ?? Number(item.dayStart);
    if (!Number.isFinite(time) || !item.owner) continue;
    const key = costaRicaDay(time).key;
    if (!keys.has(key)) continue;
    users.add(item.owner); byDay.get(key).users.add(item.owner);
    if (key === dates.at(-1).key) today.add(item.owner);
    const previous = userCountries.get(item.owner);
    if (!previous || time >= previous.time) userCountries.set(item.owner, { time, country: item.country || "ZZ" });
  }
  for (const { country } of userCountries.values()) countries.set(country, (countries.get(country) || 0) + 1);
  let totalEntries = 0;
  for (const item of entries) {
    const time = item.dayStart?.toMillis?.() ?? Number(item.dayStart);
    if (!Number.isFinite(time)) continue;
    const key = costaRicaDay(time).key;
    if (keys.has(key)) { byDay.get(key).entries++; totalEntries++; }
  }
  return { unique: users.size, today: today.size, entries: totalEntries, rows: [...byDay.values()].reverse().map((row) => ({ day: row.day, unique: row.users.size, entries: row.entries })), countries: [...countries].map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count) };
}
