import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

<<<<<<< HEAD
console.log("🤖 Ejecutando inyección total del reproductor rápido...");
=======
console.log("🤖 Iniciando robot de optimizacion de reproductor en: " + rutaArchivo);
>>>>>>> f5ef384 (Inyectado reproductor universal HLS ultra rapido con reintento automatico)

try {
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    const inicioArray = contenido.indexOf('[');
    const finArray = contenido.lastIndexOf(']') + 1;

    if (inicioArray === -1 || finArray === 0) {
        throw new Error("No se encontró la estructura de canales.");
    }

    const parteInicial = contenido.substring(0, inicioArray);
    const cadenaArray = contenido.substring(inicioArray, finArray);
    const parteFinal = contenido.substring(finArray);

    let canales = JSON.parse(cadenaArray);
<<<<<<< HEAD
    let actualizados = 0;

    canales = canales.map(canal => {
        // EXCLUSIÓN ESTRICTA: NO TOCAR Canal 7 ni Canal 13
=======
    let optimizados = 0;

    canales = canales.map(canal => {
        // EXCEPCIONES: Dejar intactos Canal 7 y Canal 13
>>>>>>> f5ef384 (Inyectado reproductor universal HLS ultra rapido con reintento automatico)
        if (
            canal.id === "tv-7-teletica" || 
            canal.id === "tv-13-sinart"
        ) {
            return canal; 
        }

<<<<<<< HEAD
        // Buscar la URL del stream (.m3u8), ya sea que esté en 'url' o escondida dentro de 'iframe_url'
        let streamUrl = canal.url;

        // Si no hay 'url', intentamos extraerla del 'iframe_url' (como en el caso de FOX)
        if (!streamUrl && canal.iframe_url) {
            // Extraer el enlace m3u8 si está dentro de un parámetro (ej. Bradmax)
            const match = canal.iframe_url.match(/(http|https):\/\/[^"'\s]+\.m3u8/i);
            if (match) {
                streamUrl = match[0];
            } else if (canal.iframe_url.includes('mediaUrl=')) {
                // Decodificar la URL si está codificada en el iframe viejo
                const urlParams = new URLSearchParams(canal.iframe_url.substring(canal.iframe_url.indexOf('?')));
                const mediaUrl = urlParams.get('mediaUrl');
                if (mediaUrl) streamUrl = decodeURIComponent(mediaUrl);
            } else if (canal.iframe_url.includes('.m3u8')) {
                 streamUrl = canal.iframe_url;
            }
        }

        // Si encontramos una URL válida, inyectamos nuestro reproductor rápido
        if (streamUrl && streamUrl.includes('.m3u8')) {
            canal.iframe_url = `/reproductor.html?src=${encodeURIComponent(streamUrl)}`;
            // Opcional: asegurarnos de que la propiedad 'url' exista limpia por si la app la usa en otra parte
            canal.url = streamUrl; 
            actualizados++;
        }

=======
        // Obtener la URL del stream (.m3u8) para metersela al nuevo reproductor agresivo
        const streamUrl = canal.url || canal.iframe_url;

        if (streamUrl && streamUrl.includes('.m3u8')) {
            // Le inyectamos un reproductor HLS ultra-ligero de jsDelivr con auto-reintento infinito
            canal.iframe_url = `https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.html?src=${encodeURIComponent(streamUrl)}&autoPlay=true`;
            optimizados++;
        }
        
>>>>>>> f5ef384 (Inyectado reproductor universal HLS ultra rapido con reintento automatico)
        return canal;
    });

    const nuevoContenido = parteInicial + JSON.stringify(canales, null, 2) + parteFinal;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');
    
<<<<<<< HEAD
    console.log(`✅ ¡Éxito total! ${actualizados} canales (incluyendo FOX) ahora usan tu reproductor ultrarrápido.`);
    console.log("Canal 7 y Canal 13 se mantuvieron con sus enlaces originales.");
=======
    console.log("✅ ¡Optimizacion completada! Se configuro el reproductor agresivo en " + optimizados + " canales.");
    console.log("Canal 7 y Canal 13 permanecen con sus configuraciones originales.");
>>>>>>> f5ef384 (Inyectado reproductor universal HLS ultra rapido con reintento automatico)

} catch (error) {
    console.error("❌ Error al procesar el archivo:", error.message);
}