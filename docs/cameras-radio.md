# Emisora de Cámaras · Fabulosa Play

## Qué hace

La selección de un canal cuya categoría sea **Cámaras** (también reconoce Camaras)
silencia ese video y presenta la emisora. Aplica automáticamente a las cámaras nuevas.
Los demás canales, las radios y las películas mantienen su comportamiento.

La emisora corre en el navegador de cada visitante. Continúa al cambiar de cámara,
se detiene al salir de Cámaras y no necesita un programa abierto en su computadora.
**Cada visitante escucha una secuencia propia; no es una señal sincronizada 24/7.**
El navegador puede exigir un toque en **Activar música de Cámaras** para habilitar audio.

- Música y mixes: orden aleatorio, sin repetir una pista hasta recorrer la biblioteca;
  tampoco repite inmediatamente al comenzar una nueva vuelta si hay varias canciones.
- IDs: cada 6 minutos por defecto; configurable.
- Voces del locutor: cada 12 minutos por defecto; configurable.
- Comerciales: cada 15 minutos por defecto y/o horarios diarios como `08:00, 12:30`.
  Siempre comienza con un ID y después reproduce los comerciales activos en orden.
  Sin un ID disponible no se inicia un bloque comercial.
- Los intervalos se cuentan mientras el visitante escucha. Los horarios usan Costa Rica.
  Si la hora llega durante una canción o un mix, el bloque espera a que termine;
  no interrumpe la pista. Un mix largo puede retrasar varios horarios: se agrupan en un bloque.
- Puede limitar cada comercial a una ventana horaria; por ejemplo `22:00–06:00`.
- Audios que fallan se omiten durante esa visita. Recargar permite volver a intentar.
- Franja visual: usa los anuncios activos del mismo panel **Franja de publicidad**,
  en el orden existente. Aparece al entrar, muestra todos una vez y se oculta;
  después de terminar espera 10 minutos por defecto y vuelve a aparecer.
  Conserva esa espera si cambia de cámara o sale y vuelve en la misma pestaña.
  Los videos publicitarios quedan silenciados para escuchar solamente la emisora.

## Instalar y publicar desde CMD

Descargue `actualizar-emisora-camaras.cjs` en Descargas y ejecute desde la carpeta del proyecto:

```bat
node "%USERPROFILE%\Downloads\actualizar-emisora-camaras.cjs" && npm run lint && npm run build
```

El instalador crea un respaldo en una carpeta temporal, verifica los archivos antes de
escribir y rechaza versiones desconocidas. No modifica los catálogos ni sube nada a la nube.
Si dice que un archivo cambió respecto al ZIP, envíe la versión actual antes de continuar.

Si lint y build terminan bien:

```bat
git add src/components/CameraPlayer.jsx src/components/CameraRadio.jsx src/components/CameraExperience.jsx src/components/CameraStationEditor.jsx src/components/cameraExperience.css src/hooks/useCameraStation.js src/utils/cameraStation.js src/utils/cameraAudioUpload.js src/components/StreamPlayer.jsx src/components/ChannelPlayer.jsx src/components/HomeAdvertising.jsx src/pages/Channels.jsx src/pages/Admin.jsx docs/cameras-radio.md docs/camera-radio-storage.sql vercel.json && git commit -m "Emisora automatica y publicidad solo en Camaras" && git push
```

Vercel queda configurado con framework Vite, build `npm run build` y salida `dist`,
conservando sus rutas y encabezados. El despliegue por Git depende de la integración existente.

## Almacenamiento gratuito

Se utiliza **Supabase Free**, opcionalmente. No hay un máximo de canciones impuesto
por esta función, pero sí cuotas de los proveedores. Al 13 de octubre de 2026:

- 1 GB de archivos en Supabase Free.
- Hasta 50 MB por archivo.
- 5 GB mensuales de salida en caché y 5 GB sin caché; son cuotas separadas.
- El catálogo permanece en su Firebase existente, con un documento por audio;
  cada carga de la biblioteca consume lecturas de Firestore. También aplican sus cuotas.

**No existe aquí almacenamiento ni emisión ilimitada gratis.** Miles de canciones
normalmente no caben en 1 GB. Empiece con una biblioteca pequeña de MP3 comprimidos,
IDs y comerciales. La transferencia puede agotarse con varios oyentes frecuentes.
Si alcanza las cuotas, el proveedor puede restringir el servicio; esta función no
contrata un plan de pago ni elimina esos límites.

También puede agregar enlaces HTTPS directos a audios alojados en un servicio propio
que permita su reproducción. No son enlaces de YouTube, páginas de descarga ni streams en vivo:
deben apuntar a archivos con duración definida. El panel verifica su duración antes de guardar.

Referencias oficiales:
https://supabase.com/docs/guides/storage/pricing
https://supabase.com/docs/guides/storage/serving/bandwidth
https://supabase.com/docs/guides/storage/uploads/file-limits
https://supabase.com/docs/guides/storage/security/access-control

## Conectar Supabase por primera vez

1. Abra https://supabase.com/dashboard y cree un proyecto en una organización **Free**,
   dedicado a estos audios. No necesita activar un plan de pago para probar esta función.
2. En **Authentication > Users > Add user**, cree el usuario `fabulosaplay@gmail.com`
   con una contraseña nueva para Supabase y active **Auto Confirm User**.
   Este usuario es distinto del inicio de sesión de Firebase; no comparta su contraseña.
3. Abra **SQL Editor**, pegue el archivo `docs/camera-radio-storage.sql` y ejecútelo.
   Creará el contenedor público `camera-radio`, con escritura y borrado restringidos
   al UUID de ese usuario. Use un proyecto dedicado sin otras políticas abiertas de escritura.
4. En la configuración/API del proyecto, copie **Project URL** y su clave pública
   **publishable** o **anon**. Nunca use **secret** o **service_role**.
5. En Fabulosa Admin, entre en **Emisora de Cámaras > Almacenamiento gratuito**.
   Pegue ambos datos y pulse **Guardar programación**. El contenedor es `camera-radio`.
6. En el mismo apartado escriba la contraseña del usuario creado y pulse
   **Conectar almacenamiento**. La contraseña no se guarda; la sesión permanece
   en memoria y termina al salir de la pestaña del panel.
7. Seleccione **IDs y sellos**, cargue al menos un ID; luego cargue música/mixes,
   comerciales y voces, usando el selector múltiple. El nombre se toma del archivo;
   puede editarlo después. Los comerciales heredan la ventana y orden indicados.
8. Configure intervalos y horarios. Use 0 para desactivar los intervalos que no necesite.
   Para comerciales solamente por horario, ponga intervalo comercial en 0.

Un fallo de carga se muestra por archivo y permite continuar con los demás. Si borra
un archivo subido debe conectar el almacenamiento; se desactiva su registro antes
de eliminar el archivo y después se elimina el registro. Si el borrado falla,
el audio permanece inactivo hasta que lo reactive o termine de eliminarlo.

## Compatibilidad y comprobación

- Cámaras HLS/MP4: el video se reproduce con volumen 0 y silencio forzado.
- Cámaras de YouTube: utiliza la API oficial con silencio y controles del proveedor ocultos;
  puede conservar marcas/avisos propios. No elimina restricciones del proveedor.
- Un iframe externo desconocido no se carga porque no permite garantizar silencio.
  En ese caso el panel de reproducción solicita HLS, MP4 o YouTube compatible.
- Cambiar una cámara a otra categoría le devuelve el comportamiento normal de TV.
- La franja conserva las dimensiones 8:1 (1920 × 240), también en pantalla completa.

Después de publicar, pruebe una cámara: active la música si el navegador lo pide,
cambie a otra cámara y compruebe que la canción continúa. Abra un canal normal:
la emisora debe detenerse y el canal debe mostrar su volumen habitual. Compruebe
que la franja se oculta después de recorrer todos los anuncios y vuelve tras la espera.

Se validaron lint/build y pruebas locales de programación, silencio, continuidad,
franja y carga con servicios simulados. Las cuentas de nube y las señales externas
requieren la conexión y comprobación en su entorno; no se crean credenciales automáticamente.
