import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaArchivo = path.join(__dirname, 'src', 'data', 'canales_finales.js');

try {
    console.log("🤖 Robot: Iniciando Reordenamiento y Cirugía...");
    const content = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Extraer el array del archivo
    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']') + 1;
    let canales = eval(content.substring(startIdx, endIdx));

    // Palabras clave para Costa Rica
    const ticosKeywords = ["Alcance TV", "Tele Proyecto", "Urbano TV", "Vía Televisión", "VNP", "Josué TV", "Zurquí TV", "¡OPA!", "Alsacias", "Repretel", "Multimedios", "Canal 6", "Canal 11", "Canal 4", "Canal 13", "Canal 1 "];

    // 1. LIMPIEZA Y CORRECCIÓN
    const canalesCorregidos = canales
        .filter(c => !c.title.toLowerCase().includes("teletica") || c.url !== "") // Quitar Teletica si no tiene link
        .map((c) => {
            let titulo = c.title;
            let url = c.url;
            let genero = c.genre;

            // Fix Repretel 6
            if (titulo.includes("Repretel 6") || titulo === "Canal 6") {
                url = "https://d2qsan2ut81n2k.cloudfront.net/live/02f0dc35-8fd4-4021-8fa0-96c277f62653/ts:abr.m3u8";
            }
            // Fix Repretel 11
            if (titulo.includes("Repretel 11")) {
                url = "https://d2n1dt6uwqq83r.cloudfront.net/index.m3u8";
            }
            // Fix Repretel 4
            if (titulo.includes("Repretel 4")) {
                url = "https://d35xpyc30huab3.cloudfront.net/index.m3u8";
            }

            // Mover a Costa Rica si coincide con keywords
            if (ticosKeywords.some(key => titulo.toLowerCase().includes(key.toLowerCase()))) {
                genero = "Costa Rica";
            }

            return { ...c, title: titulo, url: url, genre: genero };
        });

    // 2. REORDENAMIENTO CONSECUTIVO (Sin saltos de números)
    const canalesFinales = canalesCorregidos.map((c, index) => ({
        ...c,
        id: `tv-${index + 1}` // Numeración perfecta de 1 al final
    }));

    // 3. GUARDADO IMPECABLE
    const nuevoContenido = `// 🏆 BASE DE DATOS REORDENADA Y LIMPIA - ROBOT v2.0 🤖\nexport const canalesTV = ${JSON.stringify(canalesFinales, null, 4)};`;
    fs.writeFileSync(rutaArchivo, nuevoContenido, 'utf8');

    console.log(`✅ ¡ÉXITO! ${canalesFinales.length} canales numerados consecutivamente.`);
    console.log("📍 Costa Rica unificada y Repretel blindado.");

} catch (e) {
    console.error("❌ Error del Robot:", e.message);
}