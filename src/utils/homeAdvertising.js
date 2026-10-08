export const AD_STRIP_RATIO = "8 / 1";
export const AD_IMAGE_SECONDS = 10;

export function visibleHomeAds(items = []) {
  return items.filter((item) => item.enabled !== false && item.source);
}

export function homeAdSeconds(item) {
  return Math.min(120, Math.max(3, Number(item?.seconds) || AD_IMAGE_SECONDS));
}

export function safeAdDestination(value) {
  const url = String(value || "").trim();
  return (/^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url)) ? url : "";
}
