import json
import os
import re

# Categorías solicitadas
CATEGORIAS = {
    "1": "Costa Rica",
    "2": "Documentales",
    "3": "Peliculas",
    "4": "Deportes",
    "5": "Musica",
    "6": "Infantil",
    "7": "Noticias",
    "8": "Internacionales",
    "9": "Cristianos"
}

def cargar():
    try:
        with open('canales_finales.js', 'r', encoding='utf-8') as f:
            data = f.read()
            # Limpia el formato JS para que Python lo entienda como JSON
            json_str = re.sub(r'export const canalesTV = ', '', data).strip().rstrip(';')
            return json.loads(json_str)
    except Exception as e:
        print(f"Error al leer el archivo: {e}")
        return []

def guardar(lista):
    with open('canales_actualizados.js', 'w', encoding='utf-8') as f:
        f.write("export const canalesTV = " + json.dumps(lista, indent=4, ensure_ascii=False) + ";")
    print("\n[OK] Archivo guardado: canales_actualizados.js")

def robot():
    canales = cargar()
    if not canales: return
    
    final = []
    print("--- ROBOT ORGANIZADOR FABULOSA PLAY ---")
    
    total = len(canales)
    for i in range(0, total, 20):
        bloque = canales[i:i+20]
        print(f"\n--- LOTE: Canales {i+1} al {min(i+20, total)} ---")
        
        for c in bloque:
            print(f"\nCANAL: {c.get('title')} (ID Actual: {c.get('id')})")
            print("1:CR | 2:Doc | 3:Pel | 4:Dep | 5:Mus | 6:Inf | 7:Not | 8:Int | 9:Cri")
            print("B: Borrar | F: Finalizar y Guardar | S: Saltar")
            
            op = input("Selecciona (1-9/B/F/S): ").upper()
            
            if op == 'F':
                # Guarda lo que llevamos y lo que falta sin tocar
                restante = canales[canales.index(c):]
                guardar(final + restante)
                return
            
            if op == 'B':
                print(f"Borrado: {c.get('title')}")
                continue
                
            if op == 'S':
                print("Saltado.")
                final.append(c)
                continue

            if op in CATEGORIAS:
                nuevo_id = input(f"Nuevo numero para {c.get('title')}: ")
                c['id'] = f"tv-{nuevo_id}"
                c['genre'] = CATEGORIAS[op]
                final.append(c)
                print("Asignado correctamente.")
            else:
                print("Opción no válida, se mantiene original.")
                final.append(c)

    guardar(final)

if __name__ == "__main__":
    robot()