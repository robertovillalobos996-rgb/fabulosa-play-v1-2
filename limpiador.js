import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

console.log("🤖 Conectando canales al nuevo reproductor ultrarrapido de Fabulosa Play...");

try {
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    const inicioArray = contenido.indexOf('[');
    const finArray = contenido.lastIndexOf(']') + 1;

    const parteInicial = contenido.substring(0, inicioArray);
    const cadenaArray = contenido.substring(inicioArray, finArray);
    const parteFinal = contenido.substring(finArray);

    let canales = JSON.parse(cadenaArray);
    let actualizados = 0;

    canales = canales.map(canal => {
        // Exclusiones: Canal 7 y Canal 13 se quedan quietos
        if (
            canal.id === "tv-7" || canal.id === "tv-7-teletica" || 
            canal.id === "tv-13" || canal.id === "tv-13-sinart" || 
            canal.title?.includes("Teletica") || canal.title?.includes("SINART") ||
            canal.title?.includes("Canal 7") || canal.title?.includes("Canal 13")
        ) {
            return canal; 
        }

        // Buscar el enlace real del canal
        const streamUrl = canal.url || canal.iframe_url;

        if (streamUrl && streamUrl.includes('.m3u8')) {
            // Enlazar al nuevo reproductor local creado en /public
            canal.iframe_url = `/reproductor.html?src=${encodeURIComponent(streamUrl)}`;
            actualizados++;
        }

        return canal;
    });

    const nuevoContenido = parteInicial + JSON.stringify(canales, null, 2) + parteFinal;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');

    console.log(`✅ ¡Exito! ${actualizados} canales ahora usan el motor de alta velocidad hls.js.`);

} catch (error) {
    console.error("❌ Error al procesar el archivo:", error.message);
}