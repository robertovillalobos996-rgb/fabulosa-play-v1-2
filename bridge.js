import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Para que aguante el peso de las fotos

// --- TERMINAL 1: GUARDAR EL ARCHIVO JSON ---
app.post('/save-channels', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'data', 'canales_finales.js');
    const content = `export const canalesTV = ${JSON.stringify(req.body, null, 4)};`;
    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).send("Error al guardar");
        console.log("✅ Base de datos actualizada.");
        res.send("Guardado");
    });
});

// --- TERMINAL 2: GUARDAR LA IMAGEN DEL LOGO ---
app.post('/upload-logo', (req, res) => {
    const { fileName, base64Data } = req.body;
    // La carpeta donde se guardan los logos físicamente
    const logoFolder = path.join(__dirname, 'public', 'logos_canales');
    
    // Si la carpeta no existe, la creamos
    if (!fs.existsSync(logoFolder)) fs.mkdirSync(logoFolder, { recursive: true });

    const filePath = path.join(logoFolder, fileName);
    const buffer = Buffer.from(base64Data, 'base64');

    fs.writeFile(filePath, buffer, (err) => {
        if (err) return res.status(500).send("Error al guardar imagen");
        console.log(`📸 Logo guardado: ${fileName}`);
        res.send({ path: `/logos_canales/${fileName}` });
    });
});

app.listen(3001, () => console.log("🚀 Súper Puente activo en http://localhost:3001"));