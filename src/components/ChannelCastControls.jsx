import { Cast, Maximize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { castMedia, loadCast, sendChannelToCast } from '../utils/channelCast';
import { landscapeFullscreen } from '../utils/commercials';
export default function ChannelCastControls({ channel, targetRef, onTvView }) {
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [connected, setConnected] = useState(false);
  const context = useRef(null), unsubscribe = useRef(null);
  const direct = Boolean(castMedia(channel));
  useEffect(() => () => unsubscribe.current?.(), []);
  useEffect(() => {
    if (!direct || (/Safari/.test(navigator.userAgent) && !/Chrome|CriOS|Edg/.test(navigator.userAgent))) return undefined;
    let active = true; loadCast().then((cast) => { if (active) context.current = cast; }).catch(() => {});
    return () => { active = false; };
  }, [direct]);
  useEffect(() => setMessage(''), [channel.id]);
  const transmit = async () => {
    const video = targetRef.current?.querySelector('video');
    if (!direct) { setMessage('Para enviar este canal completo, use Duplicar pantalla / Smart View / AirPlay de pantalla en su teléfono, o Transmitir pestaña en Chrome de computadora. Abra Vista TV para verlo horizontal.'); return; }
    // Safari's native AirPlay picker must be invoked synchronously from the tap.
    if (video?.webkitShowPlaybackTargetPicker && !window.chrome?.cast && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|Edg/.test(navigator.userAgent)) { video.webkitShowPlaybackTargetPicker(); return; }
    setBusy(true); setMessage('');
    try {
      const cast = context.current || await loadCast(); context.current = cast;
      if (!unsubscribe.current) {
        const type = window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED;
        const update = () => setConnected(Boolean(cast.getCurrentSession()));
        cast.addEventListener(type, update); unsubscribe.current = () => cast.removeEventListener(type, update);
      }
      await sendChannelToCast(cast, channel, video?.currentTime || 0);
      setConnected(true); video?.pause(); setMessage('El televisor aceptó la señal. Controle el volumen desde el televisor.');
    } catch (error) {
      if (error === 'cancel' || error?.code === 'cancel' || error?.code === 'cancelled' || error?.name === 'AbortError') setMessage('Selección de televisor cancelada.');
      else setMessage(error?.message || 'No se pudo transmitir. Verifique que estén en la misma red Wi-Fi y que la señal sea compatible con el televisor.');
    } finally { setBusy(false); }
  };
  return <div className="mt-5"><div className="flex flex-wrap gap-2"><button type="button" className="focus-ring channel-action" disabled={busy} onClick={transmit}><Cast size={17}/>{busy ? 'Conectando…' : 'Enviar al televisor'}</button><button type="button" className="focus-ring channel-action" onClick={() => { landscapeFullscreen(targetRef.current); onTvView(); }}><Maximize size={17}/> Vista TV horizontal</button>{connected && <button type="button" className="focus-ring channel-action" onClick={() => { context.current?.endCurrentSession(true); setConnected(false); setMessage('Televisor desconectado.'); }}>Desconectar TV</button>}</div>{message && <p role="status" className="mt-3 text-xs leading-5 text-white/65">{message}</p>}<p className="mt-2 text-xs leading-5 text-white/40">Chromecast / Google Cast compatible o AirPlay en Safari. El teléfono y el televisor deben estar en la misma red Wi-Fi.</p></div>;
}
