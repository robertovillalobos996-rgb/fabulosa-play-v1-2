import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'canales_finales.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. LIMPIEZA TOTAL: Borramos versiones viejas de 6, 7, 13 y al hp del 36
    const regexLimpieza = /\s*\{\s*"id":\s*"(tv-6-repretel|tv-7-teletica|tv-13-sinart|tv-36-trivision)"[\s\S]*?\},/g;
    content = content.replace(regexLimpieza, '');

    // 2. DEFINICIÓN: El 6 ahora usa el mismo reproductor blindado que el 7
    const canalesNuevos = `
    {
        "id": "tv-6-repretel",
        "title": "Repretel Canal 6",
        "iframe_url": "https://bradmax.com/client/embed-player/c7c83ebb46fa89529a7383d933e2038729f8e4c9_13428?id=repre6&mediaUrl=https://d2qsan2ut81n2k.cloudfront.net/live/02f0dc35-8fd4-4021-8fa0-96c277f62653/ts:abr.m3u8",
        "genre": "Costa Rica",
        "logo": "/logos_canales/Repretel_6_logo.png"
    },
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
    },`;

    // 3. INSERCIÓN
    let primerCierre = content.indexOf('},');
    let segundoCierre = content.indexOf('},', primerCierre + 1);
    
    if (segundoCierre !== -1) {
        let insertPoint = segundoCierre + 2;
        let nuevoContenido = content.slice(0, insertPoint) + canalesNuevos + content.slice(insertPoint);
        fs.writeFileSync(filePath, nuevoContenido, 'utf8');
        console.log('✅ CIRUGÍA MAESTRA: Canal 6 (Bradmax), 7 y 13 listos. Trivisión eliminado.');
    }
} catch (error) {
    console.error('❌ Error en la cirugía:', error.message);
}