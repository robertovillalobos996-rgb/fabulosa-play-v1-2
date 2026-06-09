import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

console.log("🤖 Iniciando robot de limpieza en: " + rutaArchivo);

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
    let limpiados = 0;

    canales = canales.map(canal => {
        // Exclusiones obligatorias: NO TOCAR Canal 7 ni Canal 13
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

        // Para los demás canales, removemos el iframe_url para que cargue el reproductor nativo
        if (canal.iframe_url) {
            delete canal.iframe_url;
            limpiados++;
        }
        return canal;
    });

    const nuevoContenido = parteInicial + JSON.stringify(canales, null, 2) + parteFinal;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');
    
    console.log("✅ ¡Limpieza terminada con exito! Se quito Bradmax de " + limpiados + " canales.");
    console.log("Teletica Canal 7 y SINART Canal 13 se mantuvieron intactos.");

} catch (error) {
    console.error("❌ Error al procesar el archivo:", error.message);
}