import admin from "firebase-admin";
import fs from "fs";

// 1. Conectar a la base de datos
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// TU LLAVE DE YOUTUBE
const YOUTUBE_API_KEY = "AIzaSyACeTldeUs5tbn2Lwr6o_6Lc48rF1nINY0"; 

// TUS CATEGORÍAS VIP (Agregamos Documentales e Infantil)
const categorias = [
  "Documentales", "Infantil Animada", "Acción", "Ciencia Ficción", 
  "Comedia", "Terror", "Drama", "Romance", 
  "Cristianas", "Suspenso", "Artes Marciales"
];

// CONFIGURACIÓN DE VOLUMEN (Máximo 50 por página. 6 páginas = 300 películas POR CATEGORÍA)
// Total estimado: 11 categorías x 300 = ¡3,300 películas!
const PAGINAS_MAXIMAS = 6; 

// Función para no saturar a Google (Pausa de 2 segundos)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function cazarMasivo() {
  console.log("🔥 INICIANDO EXTRACCIÓN MASIVA DE CINE (NIVEL DIOS) 🔥");
  let granTotal = 0;

  for (const cat of categorias) {
    console.log(`\n==================================================`);
    console.log(`🎬 INICIANDO DESCARGA DE CATEGORÍA: ${cat.toUpperCase()}`);
    console.log(`==================================================`);
    
    let nextPageToken = "";
    let paginasDescargadas = 0;
    let peliculasPorCategoria = 0;

    // Bucle para pasar de página en YouTube
    while (paginasDescargadas < PAGINAS_MAXIMAS) {
      
      // Ajustamos la búsqueda según la categoría para ser precisos
      let query = `pelicula completa en español ${cat}`;
      if (cat === "Documentales") query = "documental completo en español HD";
      if (cat === "Infantil Animada") query = "pelicula animada infantil completa en español";

      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=long&videoDefinition=high&order=viewCount&maxResults=50&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
      
      // Si hay una página siguiente, la agregamos a la URL
      if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          console.error(`❌ Google detuvo la búsqueda (Posible límite diario):`, data.error.message);
          break; // Salimos del bucle de esta categoría
        }

        if (!data.items || data.items.length === 0) {
           console.log(`⚠️ No hay más resultados para ${cat}.`);
           break;
        }

        let batch = db.batch();
        let countLote = 0;

        for (const item of data.items) {
           const videoId = item.id.videoId;
           const snippet = item.snippet;
           
           const tituloLimpio = snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
           const tituloMinusculas = tituloLimpio.toLowerCase();

           // SÚPER FILTRO ANTI-BASURA
           const prohibidas = ["trailer", "resumen", "corto", "teaser", "gameplay", "capítulo", "episodio", "clip", "escena", "juego", "parte 1", "top 10"];
           const esBasura = prohibidas.some(palabra => tituloMinusculas.includes(palabra));

           if (esBasura) continue;

           const docRef = db.collection("peliculas").doc();
           batch.set(docRef, {
               title: tituloLimpio,
               url: `https://www.youtube.com/watch?v=${videoId}`,
               category: "Cine", 
               genero: cat, // <--- Aquí se guarda la categoría exacta (Documentales, Infantil, etc.)
               img: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
               createdAt: admin.firestore.FieldValue.serverTimestamp()
           });
           
           countLote++;
           peliculasPorCategoria++;
           granTotal++;
        }

        if (countLote > 0) {
           await batch.commit();
           console.log(`📦 Página ${paginasDescargadas + 1}: Se inyectaron ${countLote} joyas de ${cat}.`);
        }

        // Preparamos la siguiente página
        nextPageToken = data.nextPageToken;
        paginasDescargadas++;

        // Si ya no hay más páginas, terminamos con esta categoría
        if (!nextPageToken) break;

        // Dormimos al robot 2 segundos para que Google no nos detecte como ataque Spam
        await sleep(2000);

      } catch (error) {
        console.error(`❌ Falla de red en la página ${paginasDescargadas + 1}:`, error.message);
        break;
      }
    }
    console.log(`✅ TOTAL ${cat.toUpperCase()}: ${peliculasPorCategoria} películas guardadas.`);
  }

  console.log(`\n🚀🚀🚀 ¡MISIÓN CUMPLIDA! TU PLATAFORMA AHORA TIENE ${granTotal} PELÍCULAS NUEVAS EN 4K/HD 🚀🚀🚀`);
  process.exit(0);
}

cazarMasivo();