# Audiencia en vivo

Panel > Audiencia en vivo. Se destaca el canal de cámaras, la radio sonando y el nombre de cada cámara que tienen abierta las conexiones. La tabla incluye los demás canales de televisión.

## Activación

1. Instalar el actualizador y ejecutar lint y build.
2. En Firebase, proyecto fabulosaplaycr: Authentication > Sign-in method (Método de acceso) > Anonymous (Anónimo) > habilitar > guardar. Esta cuenta técnica no pide registro al visitante y se mantiene separada del acceso del administrador.
3. Publicar las reglas con `npx --yes firebase-tools deploy --only firestore:rules --project fabulosaplaycr`. Si solicita acceso, ejecutar primero `npx --yes firebase-tools login` con la cuenta administradora de ese proyecto.
4. Publicar los archivos por Git/Vercel y recargar el sitio.
5. Abrir un canal desde una ventana privada o un dispositivo distinto y comprobar el panel. La propia sesión del administrador se excluye del conteo.

## Qué significa cada cifra

- Conectados: pestañas que tienen abierto ese canal y han reportado presencia en los últimos 90 segundos; no son personas únicas ni un contador de visitas acumuladas.
- Video confirmado y visible: reproducción informada por HLS/MP4 o por la API de YouTube del canal de cámaras, con la pestaña visible. Un iframe que solo informa que terminó de cargar no confirma reproducción y se muestra por separado.
- Radio de cámaras sonando: avance efectivo del audio nativo, volumen mayor que cero y sin silencio. No permite comprobar los altavoces físicos ni el volumen del sistema operativo.
- Cámara actual: nombre configurado de la cámara que tiene abierta cada conexión al canal combinado. Las categorías múltiples se agrupan como un solo canal.
- Reproductor externo sin confirmar: pestañas con iframe de proveedor cuya reproducción real no podemos comprobar. No se muestran como video confirmado.

Latido cada 30 segundos. Al cambiar de canal o cerrar el reproductor se intenta eliminar el registro; cierres abruptos y pérdida de red vencen en 90 segundos. No se registran IP, ubicación ni nombre del visitante. Si la lectura viene de caché o no se puede verificar la configuración, el panel muestra que no tiene datos en directo, en vez de dar un cero confirmado.

## Cuotas y almacenamiento

Esta medición depende de Firebase y consume escrituras por conexión y lecturas del panel. No es ilimitada ni garantiza estar disponible si se alcanza la cuota. Con intervalo de 30 segundos una pestaña abierta continuamente genera aproximadamente 2.880 escrituras al día, además de cambios y reconexiones. Revise Uso en Firestore antes de aumentar la audiencia.

Los registros se eliminan al salir normalmente; los que dejan los cierres abruptos se ignoran cuando vencen. No se conserva un historial de audiencia en este módulo y los registros vencidos pueden limpiarse desde Firestore. No configure acceso público de lectura a liveAudience.

## Radios, películas, visitas y países

La tabla en directo incluye TV, cámaras, radios y películas con sus nombres. Las radios se marcan como audio confirmado cuando el audio avanza sin pausa ni silencio. Las películas se marcan como video confirmado mediante eventos del reproductor nativo. Abrir un reproductor no implica reproducción confirmada.

El sitio registra entradas en todas las páginas públicas, incluso Inicio, y excluye al administrador. El historial muestra hoy y los últimos 7 o 30 días, usando días de Costa Rica (UTC-6).

- Navegador único: identificador anónimo persistente de Firebase, una vez por día y una vez en el total del período. No identifica personas: diferentes dispositivos, ventanas privadas y borrar los datos cambian la identidad.
- Entrada: sesión de una pestaña. Recargar y navegar dentro de 30 minutos conserva la misma sesión; una pestaña nueva o regresar después de 30 minutos inicia otra. Si el visitante sigue usando el sitio al cambiar de día, se registra también en ese día.
- País: código de país estimado por Vercel a partir de la conexión. El endpoint /api/audience-country no guarda la dirección IP. En desarrollo local o si no puede determinarse, figura País no disponible. Una VPN puede cambiar el país. El resumen usa el país del día registrado más reciente de cada navegador en el período, sin duplicarlo entre países.

Los registros históricos empiezan con esta actualización; no se reconstruyen visitas anteriores. Se guardan en audienceDaily y audienceVisits, con escrituras de creación solamente y lectura general exclusiva del administrador. Las sesiones no eliminan su entrada histórica al salir. La presencia liveAudience sí vence o se elimina.

Publicar firestore.rules nuevamente junto con esta actualización. No necesita nuevas claves ni habilitar otro proveedor si Anónimo ya está activo.

El registro diario añade un documento por navegador/día y uno por sesión/día, no una escritura histórica por latido. El panel consulta los documentos del período elegido, lo que consume lecturas de Firestore; las cuotas siguen aplicándose. Estos datos son mediciones de los navegadores que pueden comunicarse con Firebase: bloqueadores, fallas de red y cuotas pueden impedir registros. No constituyen un conteo de personas identificadas ni un sistema antifraude.
