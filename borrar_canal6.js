import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'canales_finales.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Buscamos el inicio y fin del array para procesarlo
    const startArray = content.indexOf('[');
    const endArray = content.lastIndexOf(']') + 1;
    let jsonContent = content.slice(startArray, endArray);

    // Convertimos a objeto de JS (usando eval para manejar el formato del archivo .js)
    let canales = eval(jsonContent); 

    // 2. FILTRADO: Sacamos cualquier cosa que huela a Canal 6
    const canalesLimpios = canales.filter(canal => {
        const id = (canal.id || "").toLowerCase();
        const title = (canal.title || canal.name || "").toLowerCase();
        
        // Si el ID tiene un 6 o el título dice Repretel/Canal 6, lo borramos
        const esCanal6 = id.includes('tv-6') || title.includes('repretel') || title.includes('canal 6');
        
        return !esCanal6;
    });

    // 3. RECONSTRUCCIÓN DEL ARCHIVO
    const finalContent = `export const canalesTV = ${JSON.stringify(canalesLimpios, null, 4)};`;
    fs.writeFileSync(filePath, finalContent, 'utf8');

    const eliminados = canales.length - canalesLimpios.length;
    console.log(`✅ LIMPIEZA COMPLETADA: Se eliminaron ${eliminados} instancias de Canal 6.`);
    console.log('🚀 El resto de los canales y el reproductor Bradmax siguen intactos.');

} catch (error) {
    console.error('❌ Error en la limpieza:', error.message);
}