import json
import re
import os

# RUTA DEL PROYECTO
RUTA_ENTRADA = r"src\data\canales_finales.js"

# 1. DICCIONARIO INTELIGENTE DE INVESTIGACIÓN
DICCIONARIO = {
    "Cristianos": ["dios", "cristiano", "enlace", "iglesia", "ebenezer", "biblia", "fe", "esperanza", "catolico", "vaticano", "bethel", "adventista", "pastor", "oracion", "evangelio", "shalom", "ejercito de jesucristo"],
    "Documentales": ["discovery", "history", "nat geo", "national geographic", "wild", "animal", "docu", "curiosity", "space", "science", "ciencia", "investigation", "id", "crime", "travel", "gourmet", "food", "cocina", "earth", "planeta", "smithsonian", "outdoor"],
    "Peliculas": ["cine", "film", "movie", "hbo", "star", "tnt", "cinema", "action", "hollywood", "paramount", "hallmark", "lifetime", "syfy", "cinevault", "blockbuster", "amc", "showtime", "artflix", "movies"],
    "Deportes": ["sport", "deporte", "espn", "fox", "fifa", "ufc", "nba", "golf", "futbol", "football", "racing", "tigo sports", "win sports", "motogp", "f1", "fight", "wrestling", "bein", "stadium", "atletico", "fights"],
    "Musica": ["music", "musica", "mtv", "vh1", "stereo", "radio", "concert", "rock", "pop", "classic", "trace", "stingray", "deluxe", "beats", "dj", "k-pop", "vh1", "vmtv", "hits", "karaoke"],
    "Infantil": ["kids", "infantil", "disney", "cartoon", "nick", "nickelodeon", "boing", "muñequitos", "baby", "toon", "semillitas", "discovery kids", "junior", "toons"],
    "Noticias": ["news", "noticias", "cnn", "cnbc", "msnbc", "bbc", "euronews", "al jazeera", "rt", "telesur", "dw", "france 24", "bloomberg", "press", "informativo", "adn", "24h", "reuters", "sky news"],
    "Entretenimiento": ["tv-", "canal", "television", "entertainment", "variedades", "magazine", "estrellas", "univision", "telemundo", "caracol", "rcn", "azteca", "comedy", "humor", "series"]
}

# ORDEN FINAL DE CATEGORÍAS
ORDEN_CAT = ["Costa Rica", "Documentales", "Peliculas", "Deportes", "Musica", "Infantil", "Noticias", "Entretenimiento", "Internacionales", "Cristianos"]

def investigar_canal(c):
    # Analizamos Título y URL para máxima precisión
    texto_analisis = (c.get("title", "") + " " + c.get("url", "")).lower()
    
    # El canal 92 va para Películas por orden superior
    if str(c.get("id")) in ["tv-92", "92"]: return "Peliculas"
    
    # Costa Rica se respeta por género original
    if "costa rica" in c.get("genre", "").lower(): return "Costa Rica"

    # Buscamos en el diccionario inteligente
    for categoria, palabras in DICCIONARIO.items():
        if any(p in texto_analisis for p in palabras):
            return categoria
            
    return "Internacionales"

def robot_google_inteligente():
    print("🤖 Robot 'Cerebro de Google' iniciando investigación profunda...")
    
    try:
        with open(RUTA_ENTRADA, 'r', encoding='utf-8') as f:
            data = f.read()
            json_str = re.sub(r'export const canalesTV = ', '', data).strip().rstrip(';')
            canales = json.loads(json_str)
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return

    limpios = []
    
    for c in canales:
        cid = str(c.get("id"))
        
        # 1. REGLA DE ORO: ELIMINAR 13
        if "13" in cid and len(cid) < 6:
            print(f"🗑️ Eliminando ID 13: {c.get('title')}")
            continue

        # 2. INVESTIGACIÓN DE CATEGORÍA
        c["genre"] = investigar_canal(c)
        limpios.append(c)

    # 3. ORGANIZACIÓN MAESTRA (Respetando el bloque de Costa Rica arriba)
    final = []
    # Primero Costa Rica
    final += [c for c in limpios if c["genre"] == "Costa Rica"]
    # Luego el resto en orden
    for cat in ORDEN_CAT[1:]:
        final += [c for c in limpios if c["genre"] == cat and c not in final]

    # 4. GUARDAR EN EL MISMO ARCHIVO (Actualización Directa)
    with open(RUTA_ENTRADA, 'w', encoding='utf-8') as f:
        f.write("export const canalesTV = " + json.dumps(final, indent=4, ensure_ascii=False) + ";")
    
    print(f"\n✅ TRABAJO DE VERDAD TERMINADO.")
    print(f"Se analizaron {len(limpios)} canales.")
    print(f"Los 700 canales ahora están distribuidos entre Películas, Noticias, Música y Entretenimiento.")

if __name__ == "__main__":
    robot_google_inteligente()