const admin = require("firebase-admin");
const fs = require("fs");

// 1. Conectar con las llaves maestras de tu base de datos
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function subirMasivo() {
  console.log("🚀 Iniciando inyección masiva de canales...");
  
  // 2. Leer el archivo de texto
  const contenido = fs.readFileSync("canales_limpios.txt", "utf-8");
  const lineas = contenido.split("\n").filter(linea => linea.trim() !== "");
  
  let batch = db.batch();
  let contadorLote = 0;
  let totalSubidos = 0;

  for (let i = 0; i < lineas.length; i++) {
    const partes = lineas[i].split("|");
    
    // Verificamos que al menos tenga Título y URL
    if (partes.length >= 2) {
      const titulo = partes[0].trim();
      const url = partes[1].trim();
      // Si la línea tiene imagen en la 4ta posición, la usamos. Si no, queda vacía.
      const img = partes.length >= 4 ? partes[3].trim() : "";
      
      const docRef = db.collection("peliculas").doc();
      batch.set(docRef, {
        title: titulo,
        url: url,
        // Forzamos la categoría a "TV En Vivo" para que tu Channels.jsx lo detecte de inmediato
        category: "TV En Vivo", 
        img: img,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      contadorLote++;
      totalSubidos++;

      // Firebase permite subir un máximo de 500 documentos por lote (batch)
      // Usamos 450 por seguridad para no saturar el servidor
      if (contadorLote === 450) {
        await batch.commit();
        console.log(`📦 Lote enviado... ${totalSubidos} canales subidos hasta ahora.`);
        batch = db.batch(); // Preparamos un lote nuevo
        contadorLote = 0;
      }
    }
  }

  // Si quedaron canales en el último lote, los enviamos
  if (contadorLote > 0) {
    await batch.commit();
    console.log(`📦 Lote final enviado... ${totalSubidos} canales subidos en total.`);
  }

  console.log("✅ ¡SUBIDA COMPLETADA CON ÉXITO!");
  process.exit(0);
}

subirMasivo().catch((error) => {
  console.error("❌ Ocurrió un error en la subida:", error);
});