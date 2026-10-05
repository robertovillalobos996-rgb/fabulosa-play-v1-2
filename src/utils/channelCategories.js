export function channelCategory(channel) {
  return typeof channel?.genre === "string" ? channel.genre.trim() : "";
}

export function groupChannels(channels) {
  const groups = new Map();
  for (const channel of channels) {
    const key = channelCategory(channel);
    if (!groups.has(key)) groups.set(key, { key, title: key || "Sin categoría", channels: [] });
    groups.get(key).channels.push(channel);
  }
  return [...groups.values()];
}

function searchable(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function matchesChannelSearch(channel, search) {
  return searchable(`${channel.title || ""} ${channelCategory(channel)}`).includes(searchable(search).trim());
}

export function renameChannelCategory(channels, category, name) {
  const nextName = name.trim();
  if (!nextName) throw new Error("Escriba el nombre de la categoría.");
  return channels.map((channel) => channelCategory(channel) === category ? { ...channel, genre: nextName } : channel);
}

export function deleteChannelCategory(channels, category, deleteChannels = false) {
  return deleteChannels
    ? channels.filter((channel) => channelCategory(channel) !== category)
    : channels.map((channel) => channelCategory(channel) === category ? { ...channel, genre: "" } : channel);
}
