import fs from 'fs';

const rutaArchivo = "C:\\Users\\fabulosa play\\Documents\\fabulosa-play-v1-2\\src\\data\\canales_finales.js";

console.log("🤖 Robot aniquilador de marcas Git activado...");

try {
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    // Limpieza agresiva: Borra cualquier línea que empiece con <<<<<<<, ======= o >>>>>>>
    let contenidoLimpio = contenido
        .replace(/^<<<<<<< .*\r?\n/gm, '')
        .replace(/^=======\r?\n/gm, '')
        .replace(/^>>>>>>> .*\r?\n/gm, '');

    fs.writeFileSync(rutaArchivo, contenidoLimpio, 'utf8');
    console.log("✅ ¡Archivo limpio! Ya no hay rastro de Git en los 570 canales.");

} catch (error) {
    console.error("❌ Error al reparar el archivo:", error.message);
}