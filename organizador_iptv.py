import os
import re
import urllib.request

# Configuración de rutas fijas en el Escritorio
DESKTOP_PATH = os.path.join(os.environ['USERPROFILE'], 'Desktop')
OUTPUT_DIR = os.path.join(DESKTOP_PATH, 'iptv 2026')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'Lista_Maestra_Completa.m3u')
M3U_URL = "https://tv.latinacr.com.es/tv.latinacr.m3u"

def generar_lista_maestra_pura():
    print(f"\n[1] Asegurando directorio en el Escritorio: {OUTPUT_DIR}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("[2] Descargando la lista IPTV completa desde el servidor remoto...")
    try:
        req = urllib.request.Request(M3U_URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response:
            lineas = [line.decode('utf-8', errors='ignore').strip() for line in response.readlines()]
    except Exception as e:
        print(f"❌ Error crítico al descargar la lista maestra: {e}")
        return

    print("[3] Recolectando todos los canales con sus nombres originales completos...")
    
    canales_procesados = 0
    canal_actual = None

    # Escribir el archivo M3U único consolidado
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("#EXTM3U\n") # Cabecera obligatoria
        
        for linea in lineas:
            if linea.startswith("#EXTINF:"):
                # Extraer el nombre comercial al final de la coma (mantiene etiquetas HD, FHD, 4K exactas)
                nombre_comercial = linea.split(",")[-1] if "," in linea else ""
                
                # Extraer atributos por si Base44 los necesita para indexar
                name_match = re.search(r'tvg-name="([^"]+)"', linea)
                group_match = re.search(r'group-title="([^"]+)"', linea)
                
                # Si no tiene tvg-name, usamos el nombre comercial del final
                nombre_final = nombre_comercial.strip() if nombre_comercial else (name_match.group(1).strip() if name_match else "Canal Premium")
                grupo_final = group_match.group(1).strip() if group_match else "General"
                
                # Dejamos la etiqueta limpia con el nombre original intacto para que Base44 lo analice
                canal_actual = f'#EXTINF:-1 tvg-name="{nombre_final}" tvg-logo="" group-title="{grupo_final}",{nombre_final}'
                
            elif linea.startswith("http") and canal_actual:
                # Escribimos el bloque completo en el archivo único sin filtros que borren canales
                f.write(f"{canal_actual}\n")
                f.write(f"{linea}\n")
                canales_procesados += 1
                canal_actual = None

    print(f"\n✅ ¡Ejecución exitosa, Roberto!")
    print(f"📦 Se han consolidado {canales_procesados} canales con sus nombres completos.")
    print(f"📁 Archivo maestro guardado en:\n ➔ {OUTPUT_FILE}")

if __name__ == "__main__":
    generar_lista_maestra_pura()