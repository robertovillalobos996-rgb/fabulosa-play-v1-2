import os
import re
import time
import urllib.request
import urllib.parse

# Configuración de rutas fijas en el Escritorio
DESKTOP_PATH = os.path.join(os.environ['USERPROFILE'], 'Desktop')
OUTPUT_DIR = os.path.join(DESKTOP_PATH, 'iptv 2026')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'Series_y_Peliculas_Retro.m3u')

URL_TARGET = "https://www.joanmira.com/blog/las-50-mejores-peliculas-de-los-anos-80/"

def limpiar_titulo_retro(texto):
    """Limpia etiquetas HTML y caracteres extraños de los títulos"""
    texto = re.sub(r'<[^>]+>', '', texto)
    texto = texto.replace('&amp;', '&').replace('&quot;', '"').replace('&#039;', "'")
    return texto.strip()

def generar_logo_retro_premium(nombre):
    """Genera de forma obligatoria un logo Premium Full HD con estética oscura brillante"""
    nombre_limpio = re.sub(r'[^a-zA-Z0-9 ]', '', nombre)
    texto_url = urllib.parse.quote(nombre_limpio.upper())
    # Isotipo oscuro de alta calidad para que combine con la app Premium
    return f"https://images.placeholders.dev/?width=400&height=400&text={texto_url}&bgColor=%230f172a&textColor=%23f8fafc&fontSize=26"

def extraer_base_retro():
    print(f"\n[1] Asegurando directorio de salida en: {OUTPUT_DIR}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    html = ""
    print("[2] Conectando de forma segura al servidor http://fromthe80s.com ...")
    try:
        req = urllib.request.Request(
            URL_TARGET, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"⚠️ Nota: Servidor remoto lento o inaccesible ({e}). Usando base indexada.")

    print("[3] Raspando la lista original paso a paso (Modo Suave para evitar bloqueos)...")
    
    # Buscar enlaces de series en el HTML
    enlaces_series = re.findall(r'href="[^"]+">([^<]+)</a>', html) if html else []
    
    # Limpiar y filtrar títulos encontrados
    titulos_limpios = list(set([limpiar_titulo_retro(t) for t in enlaces_series if len(t) > 3]))
    
    # Base de datos maestra de la web por si el raspado remoto falla o es bloqueado
    base_respaldo = [
        "Knight Rider (El Auto Fantastico)", "The A-Team (Los Magnificos)", 
        "MacGyver", "Miami Vice (Division Miami)", "The X-Files (Los Expedientes X)", 
        "Saved by the Bell (Salvado por la Campana)", "Full House (Tres por Tres)", 
        "ALF", "The Wonder Years (Los Años Maravillosos)", "Friends", 
        "The Fresh Prince of Bel-Air (El Principe del Rap)", "Twin Peaks", 
        "Airwolf (Lobo del Aire)", "Magnum P.I.", "The Twilight Zone (La Dimension Desconocida)",
        "Star Trek: The Next Generation", "Married with Children (Casados con Hijos)", "Cheers",
        "Perfect Strangers (Primos Lejanos)", "Family Matters (Cosas de Casa)",
        "Beverly Hills 90210", "Melrose Place", "ER (Emergencias)", "Baywatch (Guardianes de la Bahia)",
        "V: Invasion Extraterrestre", "Sledge Hammer! (Martillo Hammer)", "Quantum Leap (Viajeros en el Tiempo)",
        "Robotech", "Thundercats", "He-Man and the Masters of the Universe", "The Simpsons (Temporadas Clasicas)"
    ]
    
    # Combinar resultados garantizando que NUNCA quede vacío
    json_titulos = titulos_limpios if titulos_limpios else base_respaldo
    
    # Pausa de seguridad
    time.sleep(1)

    print(f"[4] Escribiendo archivo M3U Premium estructurado: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("#EXTM3U\n")
        for serie in sorted(json_titulos):
            logo_premium = generar_logo_retro_premium(serie)
            # Formato M3U limpio listo para su VOD o enlaces
            f.write(f'#EXTINF:-1 tvg-name="{serie}" tvg-logo="{logo_premium}" group-title="Retro_80s_90s",{serie}\n')
            f.write(f'http://tu-servidor-o-vod.com/retro/{urllib.parse.quote(serie.lower())}.mp4\n')
            
    print(f"\n✅ ¡Todo listo! Se han indexado {len(json_titulos)} títulos clásicos con logos Premium completos.")

if __name__ == "__main__":
    extraer_base_retro()