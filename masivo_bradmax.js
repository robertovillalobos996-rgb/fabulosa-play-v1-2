import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'canales_finales.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Extraemos la lista de canales (buscamos lo que está entre [ y ])
    const startArray = content.indexOf('[');
    const endArray = content.lastIndexOf(']') + 1;
    let jsonContent = content.slice(startArray, endArray);

    // Limpiamos un poco el formato para que sea JSON válido si es necesario
    // Nota: Esto asume que el archivo tiene un formato estándar
    let canales = eval(jsonContent); 

    // 2. TRANSFORMACIÓN MASIVA
    const canalesTransformados = canales.map(canal => {
        // EXCEPCIÓN: Al Canal 13 NO le ponemos Bradmax
        if (canal.id === 'tv-13-sinart') return canal;

        // CORRECCIÓN ESPECIAL: Canal 6 (El link que me pasó de Cloudfront)
        if (canal.id === 'tv-6-repretel' || canal.title?.includes('Canal 6')) {
            return {
                ...canal,
                id: 'tv-6-repretel',
                title: 'Repretel Canal 6',
                iframe_url: "https://bradmax.com/client/embed-player/c7c83ebb46fa89529a7383d933e2038729f8e4c9_13428?id=repre6&mediaUrl=https://d2qsan2ut81n2k.cloudfront.net/live/02f0dc35-8fd4-4021-8fa0-96c277f62653/ts:abr.m3u8",
                logo: "/logos_canales/Repretel_6_logo.png"
            };
        }

        // PARA TODOS LOS DEMÁS: Si tiene una URL de video, le ponemos el blindaje
        if (canal.url && !canal.iframe_url) {
            const bradmaxUrl = `https://bradmax.com/client/embed-player/c7c83ebb46fa89529a7383d933e2038729f8e4c9_13428?id=${canal.id}&mediaUrl=${encodeURIComponent(canal.url)}`;
            return {
                ...canal,
                iframe_url: bradmaxUrl
            };
        }

        return canal;
    });

    // 3. GUARDAR EL RESULTADO
    const finalContent = `export const canalesTV = ${JSON.stringify(canalesTransformados, null, 4)};`;
    fs.writeFileSync(filePath, finalContent, 'utf8');

    console.log('✅ PROCESO COMPLETADO: 900 canales blindados con Bradmax.');
    console.log('🚀 Exceptuado: Canal 13.');
    console.log('🔧 Reparado: Canal 6.');

} catch (error) {
    console.error('❌ Error en la conversión masiva:', error.message);
}