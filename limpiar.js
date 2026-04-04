import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaArchivo = path.join(__dirname, 'src', 'data', 'canales_finales.js');

const keywordsCR = [
    "repretel", "multimedios", "teletica", "canal 1 ", "canal 13", "sinart", " opa", 
    "vm latino", "88 stereo", "nicoya", "chirripó", "lstv", "sarapiqui", "colosal", 
    "telebrunca", "tv uno", "teleuno", "ticavision", "tvsur", "tvn canal 14", "zurquí", "alsacias"
];

try {
    console.log("🤖 Robot: Iniciando cirugía en entorno ESM...");
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');

    // --- PASO 1: LIMPANDO EL DESMADRE DEL CÓDIGO ---
    // Buscamos donde empieza el array real
    const inicioArray = contenido.indexOf('[');
    const finArray = contenido.lastIndexOf(']') + 1;
    let textoArray = contenido.substring(inicioArray, finArray);

    // Eliminamos el bloque de texto basura de "Fabulosa TV" que rompe el array
    textoArray = textoArray.replace(/\/\/ --- BASE DE DATOS CANALES TV COMPLETA[\s\S]*?const canalesDB = \[[\s\S]*?{ n: "Fabulosa TV",/, '{"id": "tv-37-fix", "title": "Fabulosa TV",');

    // Convertimos a objeto real ignorando errores de formato
    let canales = eval(textoArray); 

    console.log(`📊 Robot: ${canales.length} canales detectados. Reorganizando...`);

    // --- PASO 2: CATEGORIZACIÓN Y ARREGLO DE ALSACIAS ---
    const canalesLimpios = canales.map(c => {
        let titulo = (c.title || c.n || "Canal sin nombre").trim();
        let url = (c.url || "").trim();
        let genero = "Variedades";

        // Fix específico para Alsacias (ID tv-1192) que venía roto
        if (c.id === "tv-1192" || titulo.toLowerCase().includes("alsacias")) {
            titulo = "Alsacias Televisión (Canal 28)";
            url = "https://s.emisoras.tv:8081/atv/index.m3u8";
            genero = "Costa Rica";
        }

        const tLower = titulo.toLowerCase();
        
        // Asignación de categorías
        if (keywordsCR.some(k => tLower.includes(k))) {
            genero = "Costa Rica";
        } else if (tLower.includes("movie") || tLower.includes("cine") || tLower.includes("action") || tLower.includes("thriller")) {
            genero = "Películas";
        } else if (tLower.includes("kids") || tLower.includes("disney") || tLower.includes("infantil") || tLower.includes("cartoon")) {
            genero = "Infantil";
        } else if (tLower.includes("news") || tLower.includes("noticias") || tLower.includes("24 horas")) {
            genero = "Noticias";
        } else if (tLower.includes("music") || tLower.includes("mix") || tLower.includes("fm") || tLower.includes("radio")) {
            genero = "Música";
        }

        return {
            id: c.id || `tv-${Math.random().toString(36).substr(2, 5)}`,
            title: titulo,
            url: url,
            genre: genero,
            logo: c.logo || null
        };
    });

    // --- PASO 3: ESCRITURA FINAL LIMPIA ---
    const resultadoFinal = `// 🏆 BASE DE DATOS IMPECABLE - GENERADA POR EL ROBOT 🤖\nexport const canalesTV = ${JSON.stringify(canalesLimpios, null, 4)};`;

    fs.writeFileSync(rutaArchivo, resultadoFinal, 'utf8');
    
    console.log("✅ ¡PROCESO COMPLETADO!");
    console.log("📍 Archivo impecable en: src/data/canales_finales.js");
    console.log("🇨🇷 Categoría 'Costa Rica' lista para usar.");

} catch (error) {
    console.log("❌ Error fatal:", error.message);
}