# Canal de cámaras con RadioBOSS

En TV, abra cualquier cámara de la categoría Cámaras para iniciar el canal.
Todos los enlaces de esa categoría rotan cada 240 segundos desde que se abre el canal.
La transición dura 800 ms; la hora utiliza America/Costa_Rica.
El audio continuo utiliza https://ny1.radio.serverroom.net/4437/stream y se detiene al salir de Cámaras.
RadioBOSS programa música, sellos y anuncios; no necesita Supabase para este modo.
El banner del Home queda fijo, sin audio, durante todas las cámaras.
Admin > Emisora de Cámaras permite cambiar nombre, logo por URL y enlace de audio.
El logo inicial es el de Fabulosa Play ya incluido en el sitio.
Los canales fuera de Cámaras conservan su reproducción habitual.
La programación visual corre en cada navegador, no crea un stream de video central compartido.
YouTube conserva sus marcas y enlaces del proveedor; no se cubren sus controles con un vidrio.
Si el navegador bloquea audio automático, toque el botón de volumen para habilitarlo.
El servidor debe permanecer recibiendo RadioBOSS; el reproductor intenta reconectar después de errores.
Los registros anteriores de audios no se borran.
