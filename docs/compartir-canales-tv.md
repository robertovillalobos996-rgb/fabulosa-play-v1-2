# Compartir canales y enviar al televisor

Todos los canales seleccionados muestran Copiar enlace, Compartir, WhatsApp y Facebook. El enlace usa /canales-play?channel=ID, con el identificador del catálogo, y abre ese canal. Cambiar el nombre no cambia el enlace. Un canal eliminado muestra un aviso; no abre otro canal silenciosamente. El canal combinado de cámaras conserva un enlace común aunque cambien sus categorías.

Copiar enlace usa el portapapeles y una alternativa para navegadores que bloqueen el acceso. El campo de enlace permite copiarlo manualmente. Compartir usa el menú nativo cuando existe; en otros navegadores copia el enlace. La reproducción automática puede requerir un toque por las reglas del teléfono.

## Celulares

El cuadro conserva 16:9, sin el alto mínimo de 230 px que deformaba la proporción en pantallas pequeñas. Botones táctiles de al menos 44 px. Los videos conservan su proporción sin estirarse. La calidad depende de la señal original y la conexión.

Vista TV horizontal utiliza el reproductor en toda la pantalla y solicita pantalla completa y orientación horizontal cuando el dispositivo lo permite. Algunos teléfonos, especialmente Safari, controlan la orientación ellos mismos. La opción Salir de Vista TV devuelve el catálogo; si está en pantalla completa nativa, primero use el control de salir del reproductor.

## Google Cast y AirPlay

El botón Enviar al televisor carga el SDK oficial de Google Cast, pide elegir un receptor y solicita reproducir una URL directa HTTPS HLS/MP4 compatible. Usa el Default Media Receiver oficial sin registrar una app receptora. Google Cast exige un navegador y un receptor compatibles; el teléfono y el TV deben estar en la misma red Wi-Fi. Safari ofrece su selector AirPlay nativo cuando está disponible para el video directo.

La reproducción real también depende de los códecs, CORS, cookies, tokens, restricciones regionales y de que el propio televisor pueda abrir la fuente. No se extraen enlaces privados ni se convierte un iframe en un stream. Si falla, el panel muestra el error y no afirma que está transmitiendo.

Los enlaces de YouTube y de reproductores externos no son URLs directas de medios. El canal combinado de cámaras incluye varios videos, radio y capas de publicidad/noticias: no es un único archivo o stream. Para mantener toda esa composición, use duplicación de pantalla / Smart View / AirPlay de pantalla del teléfono, o Transmitir pestaña en Chrome de computadora, con Vista TV. No se promete envío directo de esos canales mediante el receptor básico.

No hay búsqueda universal de todos los televisores: los que no tienen Google Cast/AirPlay necesitan su función de duplicación o un receptor compatible. No se puede encender el televisor remotamente desde esta web. Las pruebas locales comprueban llamadas al SDK, errores, enlaces y diseño; la comprobación en un televisor físico requiere ese dispositivo en la red del usuario.

La selección y emisión desde el televisor no se convierte en una nueva persona identificada en las estadísticas de Fabulosa Play. La pestaña permanece como conexión mientras está abierta.
