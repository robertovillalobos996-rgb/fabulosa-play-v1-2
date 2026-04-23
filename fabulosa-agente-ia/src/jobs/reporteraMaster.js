const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const FormData = require('form-data');
require('dotenv').config();

const parser = new Parser();
const DB_PATH = path.join(__dirname, '../../data/noticias.json');
const HISTORIAL_PATH = path.join(__dirname, '../../data/historial_noticias.json');
const STATS_PATH = path.join(__dirname, '../../data/stats.json');

// 📂 RUTAS DE ARCHIVOS LOCALES (Asegúrese de que estas rutas sean correctas en su PC)
const PATHS = {
    logoPsc: "C:\\Users\\allan\\Desktop\\proyecto-multimedia\\src\\assets\\logo-psc.png",
    anuncioImg: "C:\\Users\\allan\\Desktop\\anuncio 1.png",
    comercialVid: "C:\\Users\\allan\\Desktop\\proyecto-multimedia\\public\\media\\comerciales\\comercial fabulosa play 1.mp4"
};

// 🌐 SU NUEVA WEB OFICIAL DE NOTICIAS
const WEB_URL = "psc-informa.vercel.app";

// 📡 RADARES SELECCIONADOS
const FEEDS = [
    { nombre: 'CRHoy Sucesos', url: 'https://www.crhoy.com/site/rss/sucesos.xml' },
    { nombre: 'Diario Extra', url: 'https://www.diarioextra.com/rss' },
    { nombre: 'PZ Actual', url: 'https://www.pzactual.com/feed/' },
    { nombre: 'OIJ Oficial', url: 'https://citv.oij.go.cr/feed/' },
    { nombre: 'CNN Internacional', url: 'http://rss.cnn.com/rss/edition_world.rss' }
];

// 📺 FUNCIÓN PARA SOLTAR COMERCIALES
const soltarComercialRandom = async (fbToken) => {
    const esVideo = Math.random() > 0.5;
    const form = new FormData();

    try {
        if (esVideo) {
            console.log("📺 PSC PUBLICIDAD: Posteando comercial de video Fabulosa Play...");
            form.append('file', fs.createReadStream(PATHS.comercialVid));
            form.append('description', `¡Sintoniza lo mejor! Fabulosa Play y PSC Informa 🔥\n👉 https://${WEB_URL}`);
            await axios.post(`https://graph.facebook.com/v21.0/me/videos?access_token=${fbToken}`, form, { headers: form.getHeaders() });
        } else {
            console.log("🖼️ PSC PUBLICIDAD: Posteando anuncio de imagen...");
            form.append('source', fs.createReadStream(PATHS.anuncioImg));
            form.append('message', `¡ANÚNCIATE CON NOSOTROS! Llega a miles de personas 📢📈\n👉 https://${WEB_URL}`);
            await axios.post(`https://graph.facebook.com/v21.0/me/photos?access_token=${fbToken}`, form, { headers: form.getHeaders() });
        }
    } catch (e) { console.log("❌ Error en comercial:", e.message); }
};

const ejecutarCicloNoticias = async () => {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        const fbToken = (process.env.FACEBOOK_PAGE_TOKEN || "").trim();

        console.log("📡 PSC INFORMA: Escaneando radares de élite...");

        let historial = fs.existsSync(HISTORIAL_PATH) ? JSON.parse(fs.readFileSync(HISTORIAL_PATH, 'utf8')) : [];
        let stats = fs.existsSync(STATS_PATH) ? JSON.parse(fs.readFileSync(STATS_PATH, 'utf8')) : { noticiasPublicadas: 0 };

        let todas = [];
        for (const feed of FEEDS) {
            try {
                const data = await parser.parseURL(feed.url);
                data.items.forEach(item => {
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
        if (!nueva) return console.log("⏳ Sin noticias nuevas.");

        // 🧠 IA REDACTA (ESTILO PSC INFORMA)
        const resModel = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelo = resModel.data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'))[0].name;

        const prompt = `Eres el DIRECTOR de PSC INFORMA. Redacta de forma URGENTE y AGRESIVA sobre: "${nueva.titulo}". 
        REGLAS: Inicia con 🚨 PSC INFORMA: ¡ÚLTIMA HORA! 🚨. 
        Cierre obligatorio: Reporte y fotos en 👉 https://${WEB_URL}`;

        const resIA = await axios.post(`https://generativelanguage.googleapis.com/v1beta/${modelo}:generateContent?key=${apiKey}`, { contents: [{ parts: [{ text: prompt }] }] });
        let textoFinal = resIA.data.candidates[0].content.parts[0].text;

        // 📸 PUBLICAR EN FACEBOOK
        const formNoticia = new FormData();
        if (nueva.foto) {
            console.log(`🔥 Posteando noticia con imagen original de ${nueva.fuente}`);
            formNoticia.append('url', nueva.foto);
        } else {
            console.log(`📸 Sin foto original. Usando Logo PSC.`);
            formNoticia.append('source', fs.createReadStream(PATHS.logoPsc));
            textoFinal += "\n\n*(Imagen con fines ilustrativos)*";
        }
        
        formNoticia.append('caption', textoFinal);
        await axios.post(`https://graph.facebook.com/v21.0/me/photos?access_token=${fbToken}`, formNoticia, { headers: formNoticia.getHeaders() });

        // ✅ ACTUALIZAR MEMORIA
        stats.noticiasPublicadas += 1;
        fs.writeFileSync(STATS_PATH, JSON.stringify(stats));
        historial.push(nueva.link);
        fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(historial.slice(-150)));

        console.log(`✅ Noticia #${stats.noticiasPublicadas} lanzada.`);

        // 💰 COMERCIAL CADA 7 NOTICIAS
        if (stats.noticiasPublicadas % 7 === 0) {
            console.log("💰 ¡TURNO DE PUBLICIDAD! Soltando comercial...");
            await soltarComercialRandom(fbToken);
        }

    } catch (e) { console.log("❌ Error:", e.message); }
};

const iniciarReportera = () => {
    setInterval(ejecutarCicloNoticias, 10 * 60 * 1000); // Cada 10 minutos
    ejecutarCicloNoticias(); 
};

module.exports = { iniciarReportera };