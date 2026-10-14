# SEO de Fabulosa Play

Se mantienen las URLs compartidas de TV: /canales-play?channel=ID. Las emisoras tienen /radios-cr?radio=ID y las películas /cine-play?movie=ID. Cada URL abre el contenido indicado. El nombre puede cambiar sin cambiar su ID. Los enlaces internos del catálogo son enlaces HTML reales, con navegación normal y apertura en otra pestaña.

Vercel sirve las tres páginas públicas con HTML inicial que contiene título, descripción, canonical, Open Graph, Twitter Card, datos estructurados y texto/enlaces del catálogo. El mismo HTML se entrega a buscadores y personas; luego React carga el reproductor habitual. No se usa contenido oculto ni una versión exclusiva para robots.

El sitemap está en https://fabulosaplay.online/sitemap.xml y apunta al catálogo dinámico https://fabulosaplay.online/sitemap-catalogo.xml. Incluye TV, radios y películas del catálogo publicado de Firebase, con el canal combinado de cámaras una sola vez. Las cámaras individuales ocultas no se publican como canales sueltos. Tiene una caché máxima de cinco minutos en Vercel y un minuto para lectura del catálogo en la función. No hay que generar otro sitemap cuando se agregan contenidos desde el panel. La página de administrador queda excluida.

Si un ID eliminado se solicita directamente al servidor, responde 404/noindex en vez de indexar el primer canal. Una falla temporal de Firebase responde 503 con Retry-After y no sustituye el catálogo por uno vacío. En las secciones públicas JavaScript mantiene los títulos y canonicals al navegar. Al salir de una sección restaura los metadatos generales.

## Después de publicar

1. Abrir sitemap.xml y comprobar que carga el índice XML; abrir sitemap-catalogo.xml y comprobar las URLs.
2. Probar un canal, una emisora y una película por su enlace individual, desde una ventana privada.
3. Agregar la propiedad fabulosaplay.online a Google Search Console, si todavía no existe, y verificar el dominio con el registro TXT que Google entregue. No se debe inventar ese código.
4. En Search Console > Sitemaps enviar sitemap.xml. Inspeccionar una URL de cada sección y solicitar indexación. Revisar rastreo e indexación después de que Google procese las páginas.
5. Mantener nombres correctos, imágenes y descripciones originales en el catálogo. Compartir los enlaces individuales de Fabulosa Play en sus redes y medios propios.

Las funciones necesitan la conexión al catálogo público del proyecto fabulosaplaycr. vercel.json incluye dist/index.html en la función SEO y conserva las APIs de noticias y audiencia. El renderizado inicial consume solicitudes de funciones de Vercel y lecturas públicas de Firebase; siguen aplicándose las cuotas.

La presencia en Google depende del rastreo, la calidad, relevancia, competencia y disponibilidad del contenido. No se garantiza primer lugar ni que todas las páginas se indexen. No se afirma afiliación oficial con canales o emisoras externas. Los datos estructurados describen páginas, radios, servicios de TV y películas; no se inventan valoraciones, fechas de estreno o fechas de subida para obtener resultados enriquecidos.

El contenido está en español y describe países reales del catálogo para búsquedas en Costa Rica, Panamá y Latinoamérica. No se crean copias por país ni listas artificiales de palabras clave. La página enlazada sigue sujeta a las restricciones de la señal y del navegador, incluyendo permisos de reproducción automática.

La lógica de pantalla completa automática para celulares fue retirada por instrucción del usuario. Se conserva la vista normal y la opción manual de Vista TV ya instalada.
