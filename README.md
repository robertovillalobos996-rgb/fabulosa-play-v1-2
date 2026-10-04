# Fabulosa Play renovada

Aplicación React para `www.fabulosaplay.online`, preparada para televisión en vivo, radios, películas MP4, publicidad y administración privada.

## Secciones activas

- Inicio
- TV en vivo
- Radios
- Movies (archivos MP4 directos; no usa YouTube)
- Anúnciate
- Panel privado en `/admin`

## Interfaz para televisión

- Barra superior con navegación, reloj, búsqueda global y configuración.
- Buscador único para canales, emisoras y películas.
- Carrusel publicitario de hasta 20 imágenes o videos administrables.
- Cada imagen se muestra durante 10 segundos y cada video se reproduce completo antes del cambio.
- El texto y el botón sobre cada anuncio se pueden activar o desactivar.
- Preferencias locales: vista compacta, reducción de movimiento y reloj de 12/24 horas.
- Canales y radios en filas de logotipos circulares.
- Películas en tarjetas verticales estilo plataforma de streaming.
- Navegación inferior adaptable para teléfonos.

## Ejecutar en Windows CMD

```cmd
cd C:\Users\SU_USUARIO\Documents\fabulosa-play-renovada
npm install
npm run dev
```

Abra la dirección local que muestra Vite. Para validar una versión de producción:

```cmd
npm run lint
npm run build
npm run preview
```

## Configurar Firebase

El proyecto está conectado a `fabulosaplaycr`, propiedad de la cuenta de Fabulosa Play.

La forma más sencilla en Windows es ejecutar:

```cmd
configurar-administrador.cmd
```

El asistente abre el proyecto correcto, indica cómo activar correo/contraseña y crear `fabulosaplay@gmail.com`, inicia Firebase CLI y publica las reglas. Después ingrese en `/admin` y pulse **Publicar catálogo actual** una sola vez.

Las reglas incluidas permiten lectura pública únicamente del catálogo y escritura exclusivamente al correo administrador de Fabulosa Play.

En la portada, las imágenes se seleccionan directamente desde la computadora y se alojan en una cuenta gratuita de Cloudinary. Configure una sola vez `Cloud name` y un `Upload preset` sin firma desde **Panel → Publicidad**. No use ni publique el API Secret.

Los videos de la portada se alojan en YouTube: seleccione **Video de YouTube** y pegue un enlace `youtu.be`, `watch?v=`, Shorts o embed. El reproductor espera el final real del video antes de cambiar al siguiente anuncio y no necesita una clave de YouTube.

Formato recomendado para imágenes: 1920 × 600 píxeles, relación 3.2:1. Para YouTube exporte en 1920 × 1080, MP4 H.264, 30 fps y audio AAC, manteniendo textos y logotipos dentro de la franja central equivalente a 1920 × 600. La duración puede ser de 10 segundos, 30 segundos, un minuto o más.

## Películas

El panel solicita una URL HTTPS directa al archivo `.mp4`, además de portada e imagen horizontal. El video no se sube a Firebase Storage; debe estar alojado en un servicio apto para archivos grandes y reproducción web.

La lista entregada se depura antes de publicarse: excluye episodios de series, rótulos informativos y duplicados, y prefiere una versión sin la etiqueta `CAM` cuando existe. También reutiliza las fichas ya encontradas y prueba alias españoles e ingleses para los títulos difíciles.

Para completar las fichas desde TMDB sin guardar credenciales en el proyecto, abra CMD en la carpeta y ejecute:

```cmd
actualizar-peliculas.cmd
```

El archivo pedirá el token de lectura, ejecutará la importación y borrará la variable al terminar. La aplicación recibe títulos, categorías, descripciones y URLs estáticas de imágenes; no consulta TMDB durante la navegación. Revise `data\tmdb-unmatched.json` después de importar. Si un título necesita corrección, agregue su identificador numérico de TMDB en `data\tmdb-overrides.json` y vuelva a ejecutar el comando.

## Publicación

Cuando la revisión visual esté aprobada, suba esta carpeta al repositorio de GitHub conectado a Vercel. No sustituya la producción actual antes de validar Firebase y el catálogo.
