import fs from 'fs';
import path from 'path';

// Ruta exacta hacia su lista de canales
const filePath = path.join(process.cwd(), 'src', 'data', 'canales_finales.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. LIMPIEZA QUIRÚRGICA: Borramos versiones viejas de los canales 6, 7, 8, 13 y 36
    const regexLimpieza = /\s*\{\s*"id":\s*"(tv-6-repretel|tv-7-teletica|tv-8-multimedios|tv-13-sinart|tv-36-trivision)"[\s\S]*?\},/g;
    content = content.replace(regexLimpieza, '');

    // 2. DEFINICIÓN: Los canales nacionales definitivos que sí funcionan
    const canalesNuevos = `
    {
        "id": "tv-6-repretel",
        "title": "Repretel Canal 6",
        "iframe_url": "https://www.repretel.com/en-vivo/canal-6/",
        "tipo": "repre_crop",
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

    // 3. INSERCIÓN: Los metemos de terceros en la lista
    let primerCierre = content.indexOf('},');
    let segundoCierre = content.indexOf('},', primerCierre + 1);
    
    if (segundoCierre !== -1) {
        let insertPoint = segundoCierre + 2;
        let nuevoContenido = content.slice(0, insertPoint) + canalesNuevos + content.slice(insertPoint);
        fs.writeFileSync(filePath, nuevoContenido, 'utf8');
        console.log('✅ CIRUGÍA MAESTRA: Canales 6, 7 y 13 listos. Trivisión y Multimedios eliminados.');
    } else {
        console.log('❌ Error: No se pudo determinar el punto de inserción.');
    }

} catch (error) {
    console.error('❌ Error en la cirugía:', error.message);
}