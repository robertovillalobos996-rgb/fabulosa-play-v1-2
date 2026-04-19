import React from 'react';
// 1. IMPORTANTE: Importar el órgano sagrado
import FabulosaVipPlayer from '../components/FabulosaVipPlayer';
// Asumiendo que usa esta base de datos para cargar info
import canalesFinales from '../canales_finales'; 
import { useParams } from 'react-router-dom'; // Para sacar el ID de la URL

const PlayChannelPage = () => {
  const { channelId } = useParams(); // Saca el id de la URL (ej: fabulosa-tv-vip)

  // Buscamos el canal en la base de datos
  const canal = canalesFinales.find(c => c.id === channelId);

  // SI NO EXISTE EL CANAL (Seguridad)
  if (!canal) {
    return <div>Canal no encontrado</div>;
  }

  // --- 🔥 AQUÍ ESTÁ LA CIRUGÍA ---
  // Detectamos si es el canal sagrado usando el nuevo ID que pusimos
  if (canal.id === 'fabulosa-tv-vip') {
    // Si es, implantamos el imponente órgano VIP
    // Le decimos que cuando den "atrás" vuelva a /canales-play
    return <FabulosaVipPlayer backLink="/canales-play" />;
  }
  // --- 🔥 FIN DE LA CIRUGÍA ---


  // REPRODUCTOR GENÉRICO PARA EL RESTO DE CANALES (Su código antiguo)
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
        {/* ... Su navbar genérica ... */}
        <div className="p-8 flex flex-col items-center">
            <h1 className="text-3xl font-black uppercase mb-4">{canal.name}</h1>
            {/* Aquí probablemente tenga su reproductor genérico HLS */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10">
                {/* <YourGenericPlayerTag src={canal.url} /> */}
            </div>
        </div>
    </div>
  );
};

export default PlayChannelPage;