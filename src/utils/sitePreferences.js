export const defaultDisplayPreferences = { compact: false, reducedMotion: false, clock24: false };

export function getDisplayPreferences(settings) {
  const saved = settings?.displayPreferences || {};
  return Object.fromEntries(Object.entries(defaultDisplayPreferences).map(([key, fallback]) => [key, typeof saved[key] === "boolean" ? saved[key] : fallback]));
}
