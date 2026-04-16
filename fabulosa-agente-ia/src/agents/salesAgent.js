const axios = require('axios');
require('dotenv').config();

const handleMessage = async (senderId, text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY.trim();
    const fbToken = process.env.FACEBOOK_PAGE_TOKEN.trim();

    // EL CEREBRO TOTAL: VENTAS + INTELIGENCIA DE NOTICIAS
    const contextoVentas = `
      Eres Elva, la cara inteligente de "Fabulosa Play" y "PSC Informa" en Paso Canoas. 
      Eres carismÃ¡tica, servicial y una experta cerradora de ventas.

      PAQUETE ESTRELLA (PREMIUM):
      - Costo: 50,000 colones mensuales.
      - Abarca: TODO (PSC Informa, Banner Rotativo, anuncios en canales/pelÃ­culas, Radio RomÃ¡ntica y Fabulosa TV). Â¡Es presencia total por 30 dÃ­as!

      OTROS PAQUETES:
      - PSC Informa (Banners en grupos): Desde 1,500 el dÃ­a hasta 20,000 el mes (+2,000 si es video).
      - Banner Rotativo App: 30,000 mensuales.
      - Anuncios en Canales/Pelis: 30,000 mensuales.
      - Radio/TV Individual: 10,000 mensuales.

      FUNCIONES DE INTELIGENCIA:
      - Si te preguntan por noticias, sucesos o temas generales de la zona, responde con cortesÃ­a usando tu conocimiento general (eres una IA avanzada).
      - Siempre mantÃ©n un tono informativo y profesional.
      - TRUCO DE VENTA: DespuÃ©s de dar una informaciÃ³n o noticia, intenta decir algo como: "Por cierto, para que mÃ¡s gente se entere de lo que haces, Â¡puedes pautar con nosotros!".

      REGLAS:
      - SÃ© breve y usa emojis.
      - Siempre pide el WhatsApp para cerrar el trato.
    `;

    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await axios.get(listUrl);
    const modeloAUsar = listRes.data.models
      .filter(m => m.supportedGenerationMethods.includes('generateContent'))[0].name;

    const url = `https://generativelanguage.googleapis.com/v1beta/${modeloAUsar}:generateContent?key=${apiKey}`;

    const res = await axios.post(url, {
      contents: [{ 
        parts: [{ text: `${contextoVentas}\n\nUsuario dice: ${text}` }] 
      }]
    });

    if (res.data.candidates && res.data.candidates[0].content) {
      const respuestaIA = res.data.candidates[0].content.parts[0].text;

      await axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${fbToken}`, {
        recipient: { id: senderId },
        message: { text: respuestaIA }
      });

      console.log("âœ… ELVA RESPONDIÃ“ (Venta/Noticia)");
    }
  } catch (error) {
    console.error("âŒ Error de Elva:", error.response?.data?.error?.message || error.message);
  }
};

module.exports = { handleMessage };
