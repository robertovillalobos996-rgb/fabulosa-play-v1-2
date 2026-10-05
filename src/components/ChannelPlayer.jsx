import { useEffect, useMemo } from "react";
import { getChannelSource, normalizeChannelUrl } from "../utils/channelMedia";
import { isProviderChannel } from "../utils/channelPlayback";
import FullscreenButton from "./FullscreenButton";
import StreamPlayer from "./StreamPlayer";

function ProviderPlayer({ channel, source, onWatching, fullscreenTarget }) {
  useEffect(() => { onWatching(false); return () => onWatching(false); }, [onWatching, source]);
  return <div className="relative h-full w-full bg-black"><iframe title={channel.title} src={source} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen onLoad={() => onWatching(true)} className="h-full w-full border-0" />{fullscreenTarget && <FullscreenButton targetRef={fullscreenTarget} />}</div>;
}

export default function ChannelPlayer({ channel, onWatching, fullscreenTarget }) {
  const source = useMemo(() => getChannelSource(channel), [channel]);
  // Canal 7 and Canal 13 retain their original provider URL and playback attributes.
  if (isProviderChannel(channel)) return <ProviderPlayer channel={channel} source={normalizeChannelUrl(channel.iframe_url || channel.url)} onWatching={onWatching} fullscreenTarget={fullscreenTarget} />;
  if (source.type === "iframe") return <ProviderPlayer channel={channel} source={source.src} onWatching={onWatching} fullscreenTarget={fullscreenTarget} />;
  return <StreamPlayer channel={channel} source={source} onWatching={onWatching} fullscreenTarget={fullscreenTarget} />;
}
