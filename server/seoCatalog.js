import { canalesTV } from '../src/data/canales_finales.js';
import { radiosMundo } from '../src/data/radios-mundo.js';
import { movies } from '../src/data/movies.js';
import { combinedCameraCatalog } from '../src/utils/cameraChannel.js';
import { isCameraChannel } from '../src/utils/cameraStation.js';
const defaults = { channels: canalesTV, radios: radiosMundo, movies, 'camera-radio-config': {} };
const cache = new Map();
export function decodeField(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeField);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, field]) => [key, decodeField(field)]));
  return null;
}
export async function catalog(key) {
  const old = cache.get(key); if (old && Date.now() - old.time < 60000) return old.value;
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/fabulosaplaycr/databases/(default)/documents/catalog/${key}`, { signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return defaults[key];
  if (!response.ok) throw new Error('Catálogo temporalmente no disponible');
  const document = await response.json();
  const data = Object.fromEntries(Object.entries(document.fields || {}).map(([name, value]) => [name, decodeField(value)]));
  const value = key === 'camera-radio-config' ? data : Array.isArray(data.items) ? data.items : defaults[key];
  cache.set(key, { time: Date.now(), value }); return value;
}
export async function publicCatalog(kind) {
  const data = await catalog(kind);
  if (kind !== 'channels') return data;
  const config = await catalog('camera-radio-config');
  const combined = combinedCameraCatalog(data, config, isCameraChannel);
  const seen = new Set();
  return combined.filter((item) => { const id = item.combinedCameras ? 'fabulosa-camera-channel' : item.id; if (seen.has(id)) return false; seen.add(id); return true; });
}
