import fs from 'fs';

// 1. LAS RUTAS DE TUS DOS BASES DE DATOS
const fileActivos = 'C:\\Users\\allan\\Desktop\\proyecto-multimedia\\src\\data\\canales_activos.js';
const fileCanales = 'C:\\Users\\allan\\Desktop\\proyecto-multimedia\\src\\data\\canales.js';

// 2. FUNCIÓN PARA EXTRAER EL CÓDIGO DE TUS ARCHIVOS JS
function extraerDatos(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Archivo no encontrado: ${filePath}`);
        return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    // Buscamos dónde empieza y termina el arreglo [ ... ]
    const startIndex = content.indexOf('[');
    const endIndex = content.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) return [];
    
    try {
        const jsonString = content.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonString); // Convertimos el texto a una lista real
    } catch (error) {
        console.log(`❌ Error leyendo el formato de: ${filePath}`);
        return [];
    }
}

function main() {
    console.log(`🤖 Iniciando MEGA FUSIÓN de Bases de Datos...`);

    // 3. EXTRAEMOS LAS DOS LISTAS
    const lista1 = extraerDatos(fileActivos);
    const lista2 = extraerDatos(fileCanales);

    console.log(`📥 Se cargaron ${lista1.length} canales del Archivo 1.`);
    console.log(`📥 Se cargaron ${lista2.length} canales del Archivo 2.`);

    // Unimos todo en una sola lista gigante
    const listaGigante = [...lista1, ...lista2];

    // 4. ELIMINADOR DE DUPLICADOS (FILTRO ESTRICTO POR URL)
    const canalesUnicos = [];
    const urlsVistas = new Set(); // El cerebro que recuerda qué enlaces ya entraron
    let idCounter = 1;

    for (const canal of listaGigante) {
        // Asegurarnos de que tenga URL y no la hayamos visto antes
        if (canal.url && !urlsVistas.has(canal.url)) {
            urlsVistas.add(canal.url); // Lo anotamos en la memoria
            
            // Reasignamos el ID para que el orden quede perfecto (tv-1, tv-2, etc)
            canal.id = `tv-${idCounter++}`;
            canalesUnicos.push(canal);
        }
    }

    // 5. ORDENAMOS LA LISTA FINAL (Por Categoría y luego por Nombre)
    canalesUnicos.sort((a, b) => {
        if (a.genre < b.genre) return -1;
        if (a.genre > b.genre) return 1;
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    console.log(`💥 ¡Se eliminaron ${listaGigante.length - canalesUnicos.length} enlaces repetidos!`);

    // 6. GUARDAMOS LA LISTA MAESTRA FINAL
    const dirData = './src/data';
    const outputContent = `// 🏆 BASE DE DATOS DEFINITIVA Y PURIFICADA 🤖\n// Sin enlaces repetidos.\nexport const canalesTV = ${JSON.stringify(canalesUnicos, null, 4)};\n`;

    fs.writeFileSync(`${dirData}/canales_finales.js`, outputContent, 'utf-8');

    console.log(`\n🎉 ¡FUSIÓN TERMINADA JEFE!`);
    console.log(`📺 Tienes una lista impecable con ${canalesUnicos.length} canales ÚNICOS.`);
    console.log(`📁 Archivo guardado en: src/data/canales_finales.js`);
}

main();