const fs = require('fs');
const path = require('path');

// =========================================================================
// 👇 AQUÍ PONES EL ARCHIVO NUEVO QUE VAS A INSPECCIONAR (BORRA EL VIEJO Y PEGA EL NUEVO)
// =========================================================================
const ARCHIVO_A_PROCESAR = ""C:\Users\fabulosa play\Desktop\posibles-canales\mexico_limpio.txt"";

// =========================================================================
// CONFIGURACIÓN DE CARPETA BASE (DONDE SE UNE TODO EL IMPERIO)
// =========================================================================
const CARPETA_DESTINO = "C:\\Users\\fabulosa play\\Desktop\\canales-roberto";
const RUTA_RADIOS = path.join(CARPETA_DESTINO, "radios_fabulosa.txt");
const ARCHIVO_CONTROL_DB = path.join(CARPETA_DESTINO, ".base_datos_maestra.json");

// Diccionario base de archivos por categoría (Si sale una nueva, el script la crea sola)
const CATEGORIAS_ARCHIVOS = {
    "Deportes": "deportes.txt",
    "Premium": "premium.txt",
    "Infantil": "infantil.txt",
    "Noticias": "noticias.txt",
    "Religion": "religion.txt",
    "Cultura": "cultura_documentales.txt",
    "Musica": "musica.txt",
    "Costa Rica": "costa_rica.txt",
    "Mexico": "mexico.txt",
    "Nicaragua": "nicaragua.txt",
    "Colombia": "colombia.txt",
    "Panama": "panama.txt",
    "Argentina": "argentina.txt",
    "Peru": "peru.txt",
    "Venezuela": "venezuela.txt",
    "Chile": "chile.txt",
    "Ecuador": "ecuador.txt",
    "Guatemala": "guatemala.txt",
    "Republica Dominicana": "republica_dominicana.txt",
    "El Salvador": "el_salvador.txt",
    "Honduras": "honduras.txt",
    "Bolivia": "bolivia.txt",
    "Paraguay": "paraguay.txt",
    "Cuba": "cuba.txt",
    "Espana": "espana.txt",
    "Estados Unidos": "estados_unidos.txt",
    "Internacionales en Espanol": "internacionales_espanol.txt",
    "Mundo Play": "mundo_play.txt"
};

console.log("=== INICIANDO INSPECCIÓN E INYECCIÓN DIRECTA V6 ===");

// Asegurar que la carpeta de destino exista
if (!fs.existsSync(CARPETA_DESTINO)) {
    fs.mkdirSync(CARPETA_DESTINO, { recursive: true });
}

// Cargar base de datos de control para respetar tus enlaces maestros anteriores
let databaseMaestra = { urls: [] };
if (fs.existsSync(ARCHIVO_CONTROL_DB)) {
    try {
        databaseMaestra = JSON.parse(fs.readFileSync(ARCHIVO_CONTROL_DB, 'utf-8'));
    } catch (e) {
        console.log("[!] Inicializando registro de control de duplicados.");
    }
}

// Validar que el archivo de la línea 7 exista de verdad
if (!fs.existsSync(ARCHIVO_A_PROCESAR)) {
    console.error(`\n[❌] ERROR CRÍTICO: No se encontró ningún archivo en la ruta especificada de la línea 7:`);
    console.error(`    ${ARCHIVO_A_PROCESAR}`);
    console.error(`\nPor favor, abre el script, cambia la ruta de arriba por la correcta y vuelve a ejecutar.\n`);
    process.exit(1);
}

console.log(`[i] Base de datos activa: Protegiendo ${databaseMaestra.urls.length} enlaces.`);
console.log(`🔍 Analizando e inyectando contenido de: \n-> ${ARCHIVO_A_PROCESAR}\n`);

// Clasificador de Categorías Inteligente
function determinarCategoria(nombreCanal) {
    const name = nombreCanal.toLowerCase();

    // 1. Idiomas Extranjeros / Inglés -> Todo para MUNDO PLAY
    if (name.includes('arabic') || name.includes('arabe') || name.includes('al jazeera') || name.includes('india') || name.includes('russia') || name.includes('cctv') || name.includes('nhk') || name.includes('france') || name.includes('italy') || name.includes('english') || name.includes('usa ') || name.includes('us ') || name.includes('estados unidos')) {
        return "Mundo Play";
    }
    // 2. Prioridad Nacional: Costa Rica
    if (name.includes('teletica') || name.includes('repretel') || name.includes('canal 7') || name.includes('canal 6') || name.includes('canal 11') || name.includes('canal 4') || name.includes('canal 42') || name.includes('canal 36') || name.includes('canal 2') || name.includes('canal 13') || name.includes('sinart') || name.includes('canal 8') || name.includes('trivision') || name.includes('costa rica') || name.includes('cr ') || name.includes('multimedios cr') || name.includes('td+')) {
        return "Costa Rica";
    }
    // 3. Categoría: Música
    if (name.includes('music') || name.includes('musica') || name.includes('mtv') || name.includes('htv') || name.includes('telehit') || name.includes('vh1') || name.includes('exatv') || name.includes('rms')) {
        return "Musica";
    }
    // 4. Temáticos Clásicos
    if (name.includes('espn') || name.includes('fox sports') || name.includes('tudn') || name.includes('win sports') || name.includes('sport') || name.includes('bein') || name.includes('tyc') || name.includes('directv') || name.includes('deportes') || name.includes('ufc') || name.includes('golf')) return "Deportes";
    if (name.includes('hbo') || name.includes('cinemax') || name.includes('universal channel') || name.includes('star+') || name.includes('premium') || name.includes('plex') || name.includes('cinema') || name.includes('space') || name.includes('tnt')) return "Premium";
    if (name.includes('disney') || name.includes('cartoon') || name.includes('nick') || name.includes('discovery kids') || name.includes('toonie') || name.includes('infantil') || name.includes('boing')) return "Infantil";
    if (name.includes('noticias') || name.includes('cnn') || name.includes('24h') || name.includes('ntn24') || name.includes('telesur') || name.includes('24 horas')) return "Noticias";
    if (name.includes('enlace') || name.includes('cristiano') || name.includes('iglesia') || name.includes('catolico') || name.includes('religion') || name.includes('fe tv') || name.includes('oracion')) return "Religion";
    if (name.includes('discovery') || name.includes('nat geo') || name.includes('national geo') || name.includes('history') || name.includes('animal planet') || name.includes('cultura') || name.includes('odisea')) return "Cultura";

    // 5. Países Geográficos
    if (name.includes('mexico') || name.includes('mx ') || name.includes('las estrellas') || name.includes('azteca')) return "Mexico";
    if (name.includes('nicaragua') || name.includes('ni ')) return "Nicaragua";
    if (name.includes('colombia') || name.includes('co ') || name.includes('caracol') || name.includes('rcn')) return "Colombia";
    if (name.includes('panama') || name.includes('pa ') || name.includes('tvn') || name.includes('telemetro')) return "Panama";
    if (name.includes('argentina') || name.includes('ar ') || name.includes('telefe')) return "Argentina";
    if (name.includes('peru') || name.includes('pe ')) return "Peru";
    if (name.includes('venezuela') || name.includes('ve ') || name.includes('televen') || name.includes('venevision')) return "Venezuela";
    if (name.includes('chile') || name.includes('cl ')) return "Chile";
    if (name.includes('ecuador') || name.includes('ec ')) return "Ecuador";
    if (name.includes('guatemala') || name.includes('gt ')) return "Guatemala";
    if (name.includes('dominicana') || name.includes('do ')) return "Republica Dominicana";
    if (name.includes('salvador') || name.includes('sv ')) return "El Salvador";
    if (name.includes('honduras') || name.includes('hn ')) return "Honduras";
    if (name.includes('bolivia') || name.includes('bo ')) return "Bolivia";
    if (name.includes('paraguay') || name.includes('py ')) return "Paraguay";
    if (name.includes('cuba') || name.includes('cu ')) return "Cuba";
    if (name.includes('antena 3') || name.includes('telecinco') || name.includes('la 1') || name.includes('espana') || name.includes('es ')) return "Espana";

    return "Internacionales en Espanol";
}

const contenido = fs.readFileSync(ARCHIVO_A_PROCESAR, 'utf-8');
const lineas = contenido.split(/\r?\n/);

let conteoPorArchivo = {};
let canalesAgregadosCount = 0;
let duplicadosIgnoradosCount = 0;
let radiosCount = 0;

for (let i = 0; i < lineas.length; i++) {
    let linea = lineas[i].trim();
    let nombre = "";
    let url = "";

    // Soporte mixto: Lee tanto formato CANAL/URL de texto como listas M3U estándar
    if (linea.includes('CANAL:')) {
        nombre = linea.split('CANAL:')[1].trim();
        let j = i + 1;
        while (j < lineas.length && j < i + 5) {
            if (lineas[j].trim().includes('URL:')) {
                url = lineas[j].trim().split('URL:')[1].trim();
                i = j;
                break;
            }
            j++;
        }
    } else if (linea.startsWith('#EXTINF')) {
        let comaIndex = linea.lastIndexOf(',');
        nombre = comaIndex !== -1 ? linea.substring(comaIndex + 1).trim() : "Canal M3U";
        nombre = nombre.replace('#', '').replace('[', '').replace(']', '').trim();
        let j = i + 1;
        while (j < lineas.length) {
            if (lineas[j].trim() && !lineas[j].trim().startsWith('#')) {
                url = lineas[j].trim();
                i = j;
                break;
            }
            j++;
        }
    }

    if (url && url.startsWith('http')) {
        const urlNormalizada = url.trim().toLowerCase();

        // VALIDADOR ANTI-DUPLICADOS: Si el enlace matemático ya existe en tus listas base, se ignora
        if (databaseMaestra.urls.includes(urlNormalizada)) {
            duplicadosIgnoradosCount++;
            continue; 
        }

        const nombreNormalizado = nombre.toLowerCase();
        const esRadio = nombreNormalizado.includes('radio') || nombreNormalizado.includes('fm') || nombreNormalizado.includes('am ') || urlNormalizada.includes('stream') || urlNormalizada.includes(':8000');
        const tieneIndicadoresTV = nombreNormalizado.includes('tv') || nombreNormalizado.includes('canal') || nombreNormalizado.includes('hd') || urlNormalizada.includes('.m3u8');

        if (esRadio && !tieneIndicadoresTV) {
            const bloqueRadio = `CANAL: ${nombre}\nURL: ${url}\n--------------------------------------------------\n`;
            fs.appendFileSync(RUTA_RADIOS, bloqueRadio, 'utf-8');
            radiosCount++;
            databaseMaestra.urls.push(urlNormalizada);
            
            if (!conteoPorArchivo["radios_fabulosa.txt"]) conteoPorArchivo["radios_fabulosa.txt"] = 0;
            conteoPorArchivo["radios_fabulosa.txt"]++;
        } else {
            const categoriaAsignada = determinarCategoria(nombre);
            
            // Si la categoría no está en la lista estática, le inventa un archivo automáticamente (.txt)
            const nombreArchivoTxt = CATEGORIAS_ARCHIVOS[categoriaAsignada] || `${categoriaAsignada.toLowerCase().replace(/ /g, "_")}.txt`;
            const rutaCompletaTxt = path.join(CARPETA_DESTINO, nombreArchivoTxt);

            const bloqueCanal = `CANAL: ${nombre}\nURL: ${url}\n--------------------------------------------------\n`;
            fs.appendFileSync(rutaCompletaTxt, bloqueCanal, 'utf-8');
            canalesAgregadosCount++;
            databaseMaestra.urls.push(urlNormalizada);

            if (!conteoPorArchivo[nombreArchivoTxt]) conteoPorArchivo[nombreArchivoTxt] = 0;
            conteoPorArchivo[nombreArchivoTxt]++;
            
            console.log(`[Anexado ➔ ${categoriaAsignada}] -> ${nombre}`);
        }
    }
}

// Guardar los enlaces procesados para mantener blindada la base de datos
fs.writeFileSync(ARCHIVO_CONTROL_DB, JSON.stringify(databaseMaestra, null, 2), 'utf-8');

console.log("\n=======================================================");
console.log("   REPORTE DE INYECCIÓN DIRECTA TERMINADO CON ÉXITO");
console.log("=======================================================");
for (const [archivo, cantidad] of Object.entries(conteoPorArchivo)) {
    console.log(` ➕ Añadidos a [${archivo}]: ${cantidad} elementos nuevos.`);
}
console.log("-------------------------------------------------------");
console.log(` [🟢] Total Canales Nuevos Sumados: ${canalesAgregadosCount}`);
console.log(` [📻] Total Radios Nuevas Sumadas:  ${radiosCount}`);
console.log(` [⚠️] Enlaces Repetidos Descartados:  ${duplicadosIgnoradosCount}`);
console.log(`\n Todo inyectado limpiamente en tu carpeta base: Desktop\\canales-roberto`);
console.log("=======================================================\n");