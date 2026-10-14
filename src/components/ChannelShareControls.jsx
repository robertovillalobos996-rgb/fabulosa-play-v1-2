import { Copy, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { channelShareUrl, copyChannelUrl } from '../utils/channelSharing';
export default function ChannelShareControls({ channel }) {
  const [message, setMessage] = useState('');
  const url = channelShareUrl(channel, window.location.origin), title = `${channel.title} · Fabulosa Play`;
  useEffect(() => setMessage(''), [channel.id]);
  const copy = async () => { try { await copyChannelUrl(url); setMessage('Enlace del canal copiado.'); } catch (error) { setMessage(error.message); } };
  const share = async () => {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title, text: `Vea ${channel.title} en Fabulosa Play`, url }); }
    catch (error) { if (error.name !== 'AbortError') await copy(); }
  };
  return <div className="channel-sharing">
    <p className="text-sm font-bold text-white/75">Comparta este canal</p>
    <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="focus-ring channel-action" onClick={copy}><Copy size={17}/> Copiar enlace</button><button type="button" className="focus-ring channel-action" onClick={share}><Share2 size={17}/> Compartir</button><a className="focus-ring channel-action" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a className="focus-ring channel-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a></div>
    <input aria-label="Enlace directo de este canal" readOnly value={url} onFocus={(event) => event.target.select()} className="mt-3 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/65" />
    {message && <p role="status" className="mt-2 text-xs text-cyan-200">{message}</p>}
  </div>;
}
