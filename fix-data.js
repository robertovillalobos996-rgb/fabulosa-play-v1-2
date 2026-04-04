const fs = require('fs');
const path = require('path');

const filePath = "C:\\Users\\allan\\Desktop\\proyecto-multimedia\\src\\data\\canales_finales.js";

const keywordsCR = [
    "repretel", "multimedios", "teletica", "canal 13", "sinart", " opa", "canalda 26",
    "vm latino", "88 stereo", "nicoya", "chirripó", "lstv", "sarapiqui", "opa!",
    "colosal", "telebrunca", "ticavision", "tvsur", "tvn canal 14", "zurquí", "alsacias", "costa rica"
];

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const arrayStart = content.indexOf('[');
    const arrayEnd = content.lastIndexOf(']') + 1;
    const arrayStr = content.substring(arrayStart, arrayEnd);
    
    // Usamos una función para limpiar strings mal formados si los hay
    let canales = eval(arrayStr);

    const organizado = canales.map(c => {
        const t = (c.title || "").toLowerCase();
        
        if (keywordsCR.some(k => t.includes(k))) c.genre = "Costa Rica";
        else if (t.includes("movie") || t.includes("cine") || t.includes("action") || t.includes("thriller") || t.includes("film")) c.genre = "Películas";
        else if (t.includes("kids") || t.includes("disney") || t.includes("infantil") || t.includes("cartoon")) c.genre = "Infantil";
        else if (t.includes("news") || t.includes("noticias") || t.includes("24 horas")) c.genre = "Noticias";
        else if (t.includes("music") || t.includes("radio") || t.includes("fm") || t.includes("mix") || t.includes("stereo")) c.genre = "Música";
        else if (t.includes("enlace") || t.includes("iglesia") || t.includes("dios") || t.includes("bethel") || t.includes("biblia")) c.genre = "Religión";
        else c.genre = "Variedades";
        
        return c;
    });

    const finalFile = `export const canalesTV = ${JSON.stringify(organizado, null, 4)};`;
    fs.writeFileSync(filePath, finalFile, 'utf8');
    console.log("✅ Canales categorizados: Costa Rica y 6 categorías más listas.");
} catch (e) {
    console.log("❌ Error: Asegúrate de borrar el canal 'tv-1' que está dañado antes de correr esto.");
}