# Canal de cámaras con RadioBOSS

En TV aparece un único canal Fabulosa Cámaras en la primera posición. Las cámaras individuales de la categoría Cámaras permanecen en el panel como fuentes internas y no aparecen separadas en el catálogo público.
Todos los videos marcados como fuentes rotan desde que se abre el canal.
La transición dura 800 ms; la hora utiliza America/Costa_Rica.
El audio continuo utiliza https://ny1.radio.serverroom.net/4437/stream y se detiene al salir de Cámaras.
RadioBOSS programa música, sellos y anuncios; no necesita Supabase para este modo.
El banner del Home queda fijo, sin audio, durante todas las cámaras.
Admin > Emisora de Cámaras permite cambiar nombre, logo por URL y enlace de audio.
El logo inicial es el de Fabulosa Play ya incluido en el sitio.
Los canales fuera de Cámaras conservan su reproducción habitual.
La programación visual corre en cada navegador, no crea un stream de video central compartido.
YouTube conserva sus marcas visuales; la capa transparente impide tocar el reproductor de fondo.
Si el navegador bloquea audio automático, toque el botón de volumen para habilitarlo.
El servidor debe permanecer recibiendo RadioBOSS; el reproductor intenta reconectar después de errores.
Los registros anteriores de audios no se borran.

La categoría del canal único se cambia en Admin > Emisora de Cámaras. La casilla Fuente del canal de cámaras conserva su pertenencia a la mezcla, independientemente de su categoría.

## Presentación del canal
El panel permite definir el nombre de cada cámara, mostrar EN VIVO y ajustar logo/reloj entre 50% y 250%.
Los controles se muestran durante 2.5 segundos al mover el puntero o tocar la pantalla; siguen accesibles al enfocar con teclado.
Las señales nativas HLS/MP4 se precargan 20 segundos antes. Si no están reproduciendo, se conserva la anterior. Tras 20 segundos adicionales se intenta otra fuente disponible.
Las cámaras YouTube no se precargan ocultas. Sus transiciones siguen sujetas al inicio del reproductor externo.
La capa transparente cubre todas las fuentes del canal combinado, incluidas YouTube. Impide interacción con el reproductor de fondo, manteniendo accesibles volumen y pantalla completa.

## Categorías libres y recuperación
El canal combinado puede aparecer en varias categorías, separadas por coma en Emisora de Cámaras. En Canales la casilla Fuente del canal de cámaras define permanentemente qué videos se mezclan, independientemente de su categoría. Renombrar o mover fuentes conserva esa marca. Se recuperan categorías Cámaras y Cámaras en vivo; guarde Emisora de Cámaras una vez para fijar las fuentes anteriores. No se borran videos ni el audio.
