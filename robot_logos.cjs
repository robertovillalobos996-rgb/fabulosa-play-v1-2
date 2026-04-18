const fs = require('fs');
const axios = require('axios');
const path = require('path');

const FILE_PATH = 'src/data/canales_finales.js';
const LOGO_DIR = 'public/logos_canales/';

if (!fs.existsSync(LOGO_DIR)) fs.mkdirSync(LOGO_DIR, { recursive: true });

async function iniciar() {
    console.log('🚀 Iniciando escaneo...');
    let contenido = fs.readFileSync(FILE_PATH, 'utf8');
    
    // Extraer el array sin romperlo
    const inicio = contenido.indexOf('[');
    const fin = contenido.lastIndexOf(']') + 1;
    let jsonTexto = contenido.substring(inicio, fin);
    
    // Parseo directo (esto fallará si el PASO 1 no se hizo bien)
    let canales = JSON.parse(jsonTexto);
    let total = 0;

    for (let canal of canales) {
        if (!canal.logo) {
            console.log(`🔎 Buscando: ${canal.title}`);
            try {
                const query = encodeURIComponent(canal.title + ' logo png transparent');
                const url = `https://www.bing.com/images/search?q=${query}&qft=+filterui:photo-transparent`;
                
                const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                const match = data.match(/murl&quot;:&quot;(https?:\/\/[^&]+)/);
                
                if (match) {
                    const imgUrl = match[1];
                    const fileName = `${canal.id}.png`;
                    const localPath = path.join(LOGO_DIR, fileName);

                    const res = await axios({ url: imgUrl, responseType: 'stream', timeout: 5000 });
                    const writer = fs.createWriteStream(localPath);
                    res.data.pipe(writer);

                    await new Promise((resolve) => {
                        writer.on('finish', resolve);
                        writer.on('error', resolve);
                    });

                    canal.logo = `/logos_canales/${fileName}`;
                    total++;
                    console.log(`✅ OK`);
                }
            } catch (e) { console.log(`❌ Salto`); }
            await new Promise(r => setTimeout(r, 800));
        }
    }

    const resultado = `export const canalesTV = ${JSON.stringify(canales, null, 4)};`;
    fs.writeFileSync(FILE_PATH, resultado);
    console.log(`\n✨ LISTO. Canales actualizados: ${total}`);
}

iniciar();