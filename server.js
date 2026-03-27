import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json());

// === CARPETAS DE MEDIOS ===
const MEDIA_PATH = path.join(__dirname, 'public/media');
const VIDEOS_PATH = 'D:/videos'; 
app.use('/media', express.static(MEDIA_PATH));
app.use('/videos-locales', express.static(VIDEOS_PATH));

// === LECTOR DE CANALES ===
app.get('/api/db-local', (req, res) => {
    try {
        if (!fs.existsSync("canales_limpios.txt")) return res.json([]);
        const contenido = fs.readFileSync("canales_limpios.txt", "utf-8");
        const lineas = contenido.split("\n").filter(linea => linea.trim() !== "");
        const data = lineas.map((linea, index) => {
            const partes = linea.split("|");
            return {
                id: "canal_" + index,
                title: partes[0]?.trim() || "Sin Título",
                url: partes[1]?.trim() || "",
                category: partes[2]?.trim() || "TV En Vivo",
                img: partes[3]?.trim() || ""
            };
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error leyendo canales_limpios.txt" });
    }
});

// === LECTOR DE CINE ===
app.get('/api/peliculas-local', (req, res) => {
    try {
        if (!fs.existsSync("peliculas.txt")) return res.json([]);
        const contenido = fs.readFileSync("peliculas.txt", "utf-8");
        const lineas = contenido.split("\n").filter(linea => linea.trim() !== "");
        const data = lineas.map((linea, index) => {
            const partes = linea.split("|");
            return {
                id: "peli_" + index,
                title: partes[0]?.trim() || "Sin Título",
                url: partes[1]?.trim() || "",
                category: partes[2]?.trim() || "Cine",
                img: partes[3]?.trim() || ""
            };
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error leyendo peliculas.txt" });
    }
});

// === LECTOR DE ANUNCIOS VIP ===
app.get('/api/anuncios-local', (req, res) => {
    try {
        if (!fs.existsSync("anuncios.txt")) return res.json([]);
        const contenido = fs.readFileSync("anuncios.txt", "utf-8");
        const lineas = contenido.split("\n").filter(linea => linea.trim() !== "");
        const data = lineas.map((linea, index) => {
            const partes = linea.split("|");
            return {
                id: "ad_" + index,
                businessName: partes[0]?.trim() || "Empresa",
                mediaUrl: partes[1]?.trim() || "",
                promo: partes[2]?.trim() || "Promoción",
                type: partes[3]?.trim() || "image"
            };
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error leyendo anuncios.txt" });
    }
});

// === ENDPOINT FABULOSA TV ===
app.get('/api/get-media-files', (req, res) => {
    const getFiles = (subfolder) => {
        const fullPath = path.join(MEDIA_PATH, subfolder);
        if (!fs.existsSync(fullPath)) return [];
        return fs.readdirSync(fullPath)
            .filter(file => /\.(mp4|mp3|wav|m4a)$/i.test(file))
            .map(file => `/media/${subfolder}/${file}`);
    };
    res.json({
        musica: getFiles('musica'),
        ids: getFiles('ids'),
        comerciales: getFiles('comerciales'),
        voces: getFiles('voces'),
        videosTv: fs.existsSync(VIDEOS_PATH) ? fs.readdirSync(VIDEOS_PATH)
            .filter(file => /\.(mp4|webm|mkv|avi)$/i.test(file))
            .map(file => `/videos-locales/${encodeURIComponent(file)}`) : []
    });
});

// === ☢️ PROXY NUCLEAR (EVASIÓN MÁXIMA) ☢️ ===
app.get('/video-proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("Dame una URL");

    try {
        const urlObj = new URL(targetUrl);
        const domain = urlObj.origin;

        // Generamos una IP falsa aleatoria para evitar baneos de servidor
        const ipFalsa = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

        const response = await fetch(targetUrl, {
            method: 'GET',
            redirect: 'follow', // Perseguimos al servidor si intenta esconderse
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": domain + "/",
                "Origin": domain,
                "X-Forwarded-For": ipFalsa, // Engaño de IP
                "Accept": "*/*",
                "Connection": "keep-alive"
            }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        // Capturamos la URL final real (vital si la televisora nos redirigió)
        const finalUrl = response.url; 

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
        
        const contentType = response.headers.get("content-type");
        res.setHeader("Content-Type", contentType || "application/vnd.apple.mpegurl");

        if (targetUrl.includes('.m3u8') || (contentType && contentType.includes("mpegurl"))) {
            const texto = await response.text();
            const lineas = texto.split('\n');
            
            const modificadas = lineas.map(linea => {
                const limpia = linea.trim();
                
                if (limpia.startsWith('#') || limpia === '') return linea;

                let urlAbsoluta;
                if (limpia.startsWith('http')) {
                    urlAbsoluta = limpia; 
                } else {
                    // Magia: Usamos la URL final real para armar el link, no la primera
                    urlAbsoluta = new URL(limpia, finalUrl).href; 
                }
                
                return `https://fabulosa-backend.onrender.com/video-proxy?url=${encodeURIComponent(urlAbsoluta)}`;
            });

            return res.send(modificadas.join('\n'));
        } else {
            Readable.fromWeb(response.body).pipe(res);
        }
    } catch (error) {
        console.error("💀 Canal bloqueado o muerto:", targetUrl);
        res.status(500).send("Señal inaccesible");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR FABULOSA PRO ACTIVADO EN http://localhost:${PORT}`);
    console.log(`☢️  PROXY NUCLEAR ANTI-BLOQUEOS: EN LÍNEA`);
});