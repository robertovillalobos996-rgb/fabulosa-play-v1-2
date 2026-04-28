import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'canales_finales.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. LIMPIEZA TOTAL
    const regexLimpieza = /\s*\{\s*"id":\s*"(tv-7-teletica|tv-13-sinart|tv-36-trivision)"[\s\S]*?\},/g;
    content = content.replace(regexLimpieza, '');

    // 2. DEFINICIÓN: El 36 llevará un "link_externo" para que su reproductor lo maneje diferente
    const canalesNuevos = `
    {
        "id": "tv-7-teletica",
        "title": "Teletica Canal 7",
        "iframe_url": "https://bradmax.com/client/embed-player/c7c83ebb46fa89529a7383d933e2038729f8e4c9_13428?id=tv7&mediaUrl=https://cdn01.teletica.com/TeleticaLiveStream/Stream/playlist_dvr.m3u8",
        "genre": "Costa Rica",
        "logo": "/logos_canales/canal_7.png"
    },
    {
        "id": "tv-13-sinart",
        "title": "SINART Canal 13",
        "iframe_url": "https://www.dailymotion.com/embed/video/x7vh8g3?autoplay=1",
        "genre": "Costa Rica",
        "logo": "/logos_canales/canal_13.jpg"
    },
    {
        "id": "tv-36-trivision",
        "title": "Trivisión Canal 36",
        "link_externo": "https://player.instantvideocloud.net/v2/channel/1591",
        "genre": "Costa Rica",
        "logo": "/logos_canales/trivision.png"
    },`;

    let primerCierre = content.indexOf('},');
    let segundoCierre = content.indexOf('},', primerCierre + 1);
    
    if (segundoCierre !== -1) {
        let insertPoint = segundoCierre + 2;
        let nuevoContenido = content.slice(0, insertPoint) + canalesNuevos + content.slice(insertPoint);
        fs.writeFileSync(filePath, nuevoContenido, 'utf8');
        console.log('✅ CIRUGÍA AJUSTADA: Canal 36 configurado como enlace externo para evitar bloqueos.');
    }
} catch (error) {
    console.error('❌ Error:', error.message);
}