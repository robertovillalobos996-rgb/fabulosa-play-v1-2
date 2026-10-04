# Revisión técnica — Fabulosa Play renovada

## Estado

- Arquitectura: React 19 + Vite 6 + Tailwind CSS.
- Navegación pública reducida a Inicio, Canales, Radios, Movies y Anúnciate.
- Panel administrativo privado con Firebase Authentication.
- Catálogos editables en Firestore: canales, radios, películas, banners y contacto.
- Imágenes administrables mediante URL HTTPS, sin depender de Firebase Storage ni activar facturación.
- Movies reproduce URLs HTTPS directas de archivos MP4.
- Integración de YouTube y sus API eliminada completamente.
- Inicio rediseñado para pantallas horizontales y Smart TV.
- Búsqueda global unificada para TV, radio y películas.
- Reloj y preferencias persistentes por dispositivo.
- Carrusel administrable limitado a 20 imágenes con intervalo configurable.

## Catálogos incluidos

- 597 canales.
- 116 radios.
- Películas: catálogo inicialmente vacío, listo para carga manual.
- Logos circulares en las vistas de canales y radios.

## Seguridad

- No hay claves privadas ni contraseñas en el código.
- La configuración web de Firebase es pública por diseño; la protección se aplica mediante Authentication y reglas.
- Firestore: lectura pública de `catalog/*`, escritura autenticada y denegación para el resto.
- Backend vinculado al proyecto propio `fabulosaplaycr`.
- Vercel agrega cabeceras básicas de seguridad y reescribe rutas públicas hacia la SPA.

## Pendiente antes de producción

1. Activar Correo/contraseña en Firebase Authentication.
2. Crear y verificar el usuario administrador.
3. Desplegar las reglas después de confirmar que el proyecto Firebase puede dedicarse al nuevo sitio.
4. Publicar el catálogo local desde el panel.
5. Agregar películas MP4, número de WhatsApp y redes sociales.
6. Revisar o sustituir las señales HTTP heredadas que los navegadores modernos pueden bloquear.
7. Hacer la revisión visual final y después desplegar en GitHub/Vercel.
