const fs = require('fs');
const path = require('path');

// 1. AQUÍ CAMBIAS LA URL Y EL NOMBRE QUE QUIERAS DARLE AL ARCHIVO CADA VEZ QUE TE PASE UNA NUEVA LISTA
const URL_A_PROCESAR = "﻿https://iptv-org.github.io/iptv/categories/documentary.m3u";
const NOMBRE_DEL_ARCHIVO_TXT = "pelis_limpio.txt"; // Ej: "costa_rica_limpio.txt", "deportes_nuevos.txt", etc.

// Ruta de la nueva carpeta independiente en el Escritorio
const CARPETA_LABORATORIO = "C:\\Users\\fabulosa play\\Desktop\\posibles-canales";
const RUTA_FINAL_TXT = path.join(CARPETA_LABORATORIO, NOMBRE_DEL_ARCHIVO_TXT);

console.log("=== INICIANDO DESCARGADOR DE POSIBLES CANALES ===");

// Crear la carpeta laboratorio si no existe
if (!fs.existsSync(CARPETA_LABORATORIO)) {
    fs.mkdirSync(CARPETA_LABORATORIO, { recursive: true });
    console.log(`[✓] Carpeta creada con éxito en el Escritorio: posibles-canales`);
}

console.log(`-> Conectando a internet para descargar: ${URL_A_PROCESAR}`);

fetch(URL_A_PROCESAR)
    .then(res => {
        if (!res.ok) throw new Error(`Error de conexión con el servidor: ${res.status}`);
        return res.text();
    })
    .then(contenido => {
        console.log("-> Lista descargada. Extrayendo canales paso a paso...");
        
        const lineas = contenido.split(/\r?\n/);
        let textoEstructurado = "==================================================\n";
        textoEstructurado += `   REPORTE DE EXTRACCION: ${NOMBRE_DEL_ARCHIVO_TXT.toUpperCase()}\n`;
        textoEstructurado += "==================================================\n\n";
        
        let contador = 0;

        for (let i = 0; i < lineas.length; i++) {
            let linea = lineas[i].trim();

            if (linea.startsWith('#EXTINF')) {
                let comaIndex = linea.lastIndexOf(',');
                let nombreCanal = comaIndex !== -1 ? linea.substring(comaIndex + 1).trim() : "Canal Sin Nombre";
                
                // Limpieza de caracteres basura comunes en el nombre
                nombreCanal = nombreCanal.replace('#', '').replace('[', '').replace(']', '').replace('*', '').trim();

                let urlCanal = "";
                let j = i + 1;
                while (j < lineas.length) {
                    let siguienteLinea = lineas[j].trim();
                    if (siguienteLinea && !siguienteLinea.startsWith('#')) {
                        urlCanal = siguienteLinea;
                        i = j;
                        break;
                    }
                    if (siguienteLinea.startsWith('#')) break;
                    j++;
                }

                if (urlCanal && urlCanal.startsWith('http')) {
                    contador++;
                    textoEstructurado += `${contador}. CANAL: ${nombreCanal}\n`;
                    textoEstructurado += `   URL: ${urlCanal}\n`;
                    textoEstructurado += `--------------------------------------------------\n`;
                }
            }
        }

        textoEstructurado += `\n-> Fin de la lista. Total canales útiles extraídos: ${contador}\n`;

        // Guardar el archivo limpio dentro de la carpeta "posibles-canales"
        fs.writeFileSync(RUTA_FINAL_TXT, textoEstructurado, 'utf-8');
        
        console.log("\n==================================================");
        console.log("       ¡EXTRACCIÓN EXITOSA EN CARPETA!");
        console.log("==================================================");
        console.log(`[✓] Archivo generado: ${NOMBRE_DEL_ARCHIVO_TXT}`);
        console.log(`[✓] Ubicación: ${RUTA_FINAL_TXT}`);
        console.log(`[✓] Canales guardados listos para revisar: ${contador}`);
        console.log("==================================================\n");
    })
    .catch(err => {
        console.error("\n[!] Error en el proceso:");
        console.error(err.message);
    });