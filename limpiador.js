import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

console.log("🤖 Robot de emergencia activado: Eliminando reproductor roto...");

try {
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    const inicioArray = contenido.indexOf('[');
    const finArray = contenido.lastIndexOf(']') + 1;

    const parteInicial = contenido.substring(0, inicioArray);
    const cadenaArray = contenido.substring(inicioArray, finArray);
    const parteFinal = contenido.substring(finArray);

    let canales = JSON.parse(cadenaArray);
    let arreglados = 0;

    canales = canales.map(canal => {
        // Si el canal tiene el enlace malo que te di, lo borramos
        if (canal.iframe_url && canal.iframe_url.includes('@clappr')) {
            delete canal.iframe_url;
            arreglados++;
        }
        return canal;
    });

    const nuevoContenido = parteInicial + JSON.stringify(canales, null, 2) + parteFinal;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');

    console.log(`✅ ¡Emergencia resuelta! Se quito el enlace roto de ${arreglados} canales.`);

} catch (error) {
    console.error("❌ Error al reparar el archivo:", error.message);
}