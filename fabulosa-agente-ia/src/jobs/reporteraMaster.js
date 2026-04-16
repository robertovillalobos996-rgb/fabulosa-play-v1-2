const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const FormData = require('form-data');
require('dotenv').config();

const parser = new Parser();
const DB_PATH = path.join(__dirname, '../../data/noticias.json');
const HISTORIAL_PATH = path.join(__dirname, '../../data/historial_noticias.json');
const STATS_PATH = path.join(__dirname, '../../data/stats.json'); // Para contar las 7 noticias

// ðŸ“‚ RUTAS DE ARCHIVOS LOCALES
const PATHS = {
    logoPsc: "C:\\Users\\allan\\Desktop\\proyecto-multimedia\\src\\assets\\logo-psc.png",
    anuncioImg: "C:\\Users\\allan\\Desktop\\anuncio 1.png",
    comercialVid: "C:\\Users\\allan\\Desktop\\proyecto-multimedia\\public\\media\\comerciales\\comercial fabulosa play 1.mp4"
};

const WEB_URL = "www.fabulosaplay.online";

// ðŸ“¡ RADARES SELECCIONADOS (Los mÃ¡s efectivos + CNN)
const FEEDS = [
    { nombre: 'CRHoy Sucesos', url: 'https://www.crhoy.com/site/rss/sucesos.xml' },
    { nombre: 'Diario Extra', url: 'https://www.diarioextra.com/rss' },
    { nombre: 'PZ Actual', url: 'https://www.pzactual.com/feed/' },
    { nombre: 'OIJ Oficial', url: 'https://citv.oij.go.cr/feed/' },
    { nombre: 'CNN Internacional', url: 'http://rss.cnn.com/rss/edition_world.rss' } // Filtro manual en el cÃ³digo
];

// ðŸ“º FUNCIÃ“N PARA SOLTAR COMERCIALES
const soltarComercialRandom = async (fbToken) => {
    const esVideo = Math.random() > 0.5;
    const form = new FormData();

    try {
        if (esVideo) {
            console.log("ðŸ“º PSC PUBLICIDAD: Posteando comercial de video Fabulosa Play...");
            form.append('file', fs.createReadStream(PATHS.comercialVid));
            form.append('description', `Â¡Sintoniza lo mejor! Fabulosa Play y PSC Informa ðŸŽ§ðŸ”¥\nðŸ‘‰ ${WEB_URL}`);
            await axios.post(`https://graph.facebook.com/v21.0/me/videos?access_token=${fbToken}`, form, { headers: form.getHeaders() });
        } else {
            console.log("ðŸ–¼ï¸ PSC PUBLICIDAD: Posteando anuncio de imagen...");
            form.append('source', fs.createReadStream(PATHS.anuncioImg));
            form.append('message', `Â¡ANÃšNCIATE CON NOSOTROS! Llega a miles de personas en la Zona Sur ðŸ“¢ðŸ“ˆ\nðŸ‘‰ ${WEB_URL}`);
            await axios.post(`https://graph.facebook.com/v21.0/me/photos?access_token=${fbToken}`, form, { headers: form.getHeaders() });
        }
    } catch (e) { console.log("âŒ Error en comercial:", e.message); }
};

const ejecutarCicloNoticias = async () => {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        const fbToken = (process.env.FACEBOOK_PAGE_TOKEN || "").trim();

        console.log("ðŸ“¡ PSC INFORMA: Escaneando radares de Ã©lite...");

        // 1. CARGAR MEMORIA Y ESTADÃSTICAS
        let historial = fs.existsSync(HISTORIAL_PATH) ? JSON.parse(fs.readFileSync(HISTORIAL_PATH, 'utf8')) : [];
        let stats = fs.existsSync(STATS_PATH) ? JSON.parse(fs.readFileSync(STATS_PATH, 'utf8')) : { noticiasPublicadas: 0 };

        // 2. RASTREO
        let todas = [];
        for (const feed of FEEDS) {
            try {
                const data = await parser.parseURL(feed.url);
                data.items.forEach(item => {
                    // Filtro CNN: Solo si menciona Guerra, Costa Rica o Sucesos Graves
                    if (feed.nombre === 'CNN Internacional') {
                        const palabrasClave = ['war', 'conflict', 'dead', 'grave', 'costa rica', 'emergency', 'attack'];
                        const contenido = (item.title + item.contentSnippet).toLowerCase();
                        if (!palabrasClave.some(p => contenido.includes(p))) return;
                    }

                    const img = item.enclosure?.url || (item.content?.match(/src="([^"]+)"/) || [])[1] || null;
                    todas.push({ fuente: feed.nombre, titulo: item.title, link: item.link, resumen: item.contentSnippet || "", foto: img });
                });
            } catch (e) {}
        }

        const nueva = todas.find(n => !historial.includes(n.link));
        if (!nueva) return console.log("â³ Sin noticias nuevas.");

        // 3. IA REDACTA (PSC INFORMA STYLE)
        const resModel = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelo = resModel.data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'))[0].name;

        const prompt = `Eres el DIRECTOR de PSC INFORMA. Redacta de forma URGENTE y AGRESIVA sobre: "${nueva.titulo}". 
        REGLAS: Inicia con ðŸš¨ PSC INFORMA: Â¡ÃšLTIMA HORA! ðŸš¨. Si es noticia de CNN, menciÃ³nalo como reporte internacional grave. 
        Cierre obligatorio: Reporte y fotos en ðŸ‘‰ https://${WEB_URL}/noticias`;

        const resIA = await axios.post(`https://generativelanguage.googleapis.com/v1beta/${modelo}:generateContent?key=${apiKey}`, { contents: [{ parts: [{ text: prompt }] }] });
        let textoFinal = resIA.data.candidates[0].content.parts[0].text;

        // 4. PUBLICAR EN FACEBOOK CON LÃ“GICA DE FOTO
        const formNoticia = new FormData();
        if (nueva.foto) {
            console.log(`ðŸ”¥ Posteando noticia con imagen original de ${nueva.fuente}`);
            formNoticia.append('url', nueva.foto);
        } else {
            console.log(`ðŸ“¸ Sin foto original. Usando Logo PSC e indicando ilustraciÃ³n.`);
            formNoticia.append('source', fs.createReadStream(PATHS.logoPsc));
            textoFinal += "\n\n*(Imagen con fines ilustrativos)*";
        }
        
        formNoticia.append('caption', textoFinal);
        await axios.post(`https://graph.facebook.com/v21.0/me/photos?access_token=${fbToken}`, formNoticia, { headers: formNoticia.getHeaders() });

        // 5. ACTUALIZAR TODO
        stats.noticiasPublicadas += 1;
        fs.writeFileSync(STATS_PATH, JSON.stringify(stats));
        historial.push(nueva.link);
        fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(historial.slice(-150)));

        console.log(`âœ… Noticia #${stats.noticiasPublicadas} lanzada.`);

        // 6. EL MOMENTO DE LA PLATA (Comercial cada 7 noticias)
        if (stats.noticiasPublicadas % 7 === 0) {
            console.log("ðŸ’° Â¡TURNO DE PUBLICIDAD! Soltando comercial...");
            await soltarComercialRandom(fbToken);
        }

    } catch (e) { console.log("âŒ Error:", e.message); }
};

const iniciarReportera = () => {
    setInterval(ejecutarCicloNoticias, 10 * 60 * 1000); // 10 min
    ejecutarCicloNoticias(); 
};

module.exports = { iniciarReportera };
