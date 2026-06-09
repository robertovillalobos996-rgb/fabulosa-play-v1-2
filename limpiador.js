import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

console.log("🤖 Iniciando robot de optimizacion de reproductor en: " + rutaArchivo);

try {
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    const inicioArray = contenido.indexOf('[');
    const finArray = contenido.lastIndexOf(']') + 1;
    
    if (inicioArray === -1 || finArray === 0) {
        throw new Error("No se encontro la estructura de canales.");
    }

    const parteInicial = contenido.substring(0, inicioArray);
    const cadenaArray = contenido.substring(inicioArray, finArray);
    const parteFinal = contenido.substring(finArray);

    let canales = JSON.parse(cadenaArray);
    let optimizados = 0;

    canales = canales.map(canal => {
        // EXCEPCIONES: Dejar intactos Canal 7 y Canal 13
        if (
            canal.id === "tv-7" || 
            canal.id === "tv-7-teletica" || 
            canal.id === "tv-13" || 
            canal.id === "tv-13-sinart" || 
            canal.title?.includes("Teletica") || 
            canal.title?.includes("Canal 7") || 
            canal.title?.includes("Canal 13") || 
            canal.title?.includes("SINART")
        ) {
            return canal; 
        }

        // Obtener la URL del stream (.m3u8) para metersela al nuevo reproductor agresivo
        const streamUrl = canal.url || canal.iframe_url;

        if (streamUrl && streamUrl.includes('.m3u8')) {
            // Le inyectamos un reproductor HLS ultra-ligero de jsDelivr con auto-reintento infinito
            canal.iframe_url = `https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.html?src=${encodeURIComponent(streamUrl)}&autoPlay=true`;
            optimizados++;
        }
        
        return canal;
    });

    const nuevoContenido = parteInicial + JSON.stringify(canales, null, 2) + parteFinal;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');
    
    console.log("✅ ¡Optimizacion completada! Se configuro el reproductor agresivo en " + optimizados + " canales.");
    console.log("Canal 7 y Canal 13 permanecen con sus configuraciones originales.");

} catch (error) {
    console.error("❌ Error al procesar el archivo:", error.message);
}