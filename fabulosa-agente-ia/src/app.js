// 1. CARGA DE CONFIGURACIÃ“N Y LIBRERÃAS
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { iniciarReportera } = require('./jobs/reporteraMaster');
const { handleMessage } = require('./agents/salesAgent');

const app = express();
app.use(express.json());

// 2. RUTA PARA TU WEB (La Card de Noticias leerÃ¡ esto)
// Esto entrega el contenido de noticias.json a tu NewsCenter.jsx
app.get('/api/noticias', (req, res) => {
    const dbPath = path.join(__dirname, '../data/noticias.json');
    if (fs.existsSync(dbPath)) {
        const noticias = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        res.json(noticias);
    } else {
        res.json([]);
    }
});

// 3. WEBHOOK DE FACEBOOK (Para el Chat de Ventas con Elva)
app.post('/webhook', (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            if (entry.messaging && entry.messaging[0]) {
                const webhook_event = entry.messaging[0];
                const sender_id = webhook_event.sender.id;
                const text = webhook_event.message.text;
                
                console.log(`ðŸ“© Mensaje recibido: ${text}`);
                // Elva vendedora procesa el mensaje
                handleMessage(sender_id, text);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// 4. VERIFICACIÃ“N DEL WEBHOOK (Para configurar en Facebook Developers)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log("âœ… WEBHOOK VERIFICADO CORRECTAMENTE");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 5. ARRANQUE DEL SISTEMA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`ðŸš€ SISTEMA PSC INFORMA & FABULOSA PLAY ACTIVO`);
    console.log(`ðŸ“¡ Escuchando en el puerto: ${PORT}`);
    console.log('--------------------------------------------------');
    
    // ðŸ”¥ ENCENDER EL MOTOR DE NOTICIAS AUTOMÃTICO
    // Esto harÃ¡ que Elva trabaje sola cada 10 minutos
    iniciarReportera();
});
