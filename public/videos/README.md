# Vídeos del Hero

Descarga estos 4 vídeos desde Pexels (licencia gratuita, sin atribución requerida)
y guárdalos en esta carpeta con los nombres indicados.

| Archivo a crear          | Enlace de descarga Pexels                                                              |
|--------------------------|----------------------------------------------------------------------------------------|
| `hero-mountains.mp4`     | https://www.pexels.com/es-es/video/montanas-naturaleza-cielo-nubes-8233032/            |
| `hero-lake-cabin.mp4`    | https://www.pexels.com/es-es/video/35289457/                                           |
| `hero-villa-garden.mp4`  | https://www.pexels.com/es-es/video/cielo-edificio-jardin-arboles-8440738/              |
| `hero-apartment.mp4`     | https://www.pexels.com/es-es/video/casa-mesa-ventanas-apartamento-7578554/             |

## Instrucciones

1. Abre cada enlace y haz clic en **"Descarga gratuita"**.
2. Selecciona la resolución **HD (1080p)** — buen balance calidad/tamaño.
3. Renombra el archivo descargado al nombre indicado en la tabla.
4. Colócalo en `public/videos/`.

## Recomendaciones de optimización (opcional)

Para reducir el tamaño y mejorar el rendimiento, puedes transcodificar con ffmpeg:

```bash
ffmpeg -i hero-mountains.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 28 -preset slow -an hero-mountains-opt.mp4
```

- `-crf 28` → buena calidad, tamaño reducido (~60% menor que el original)
- `-an` → eliminar audio (los vídeos son muted, no se necesita)
- `scale=1920:-2` → máximo 1920px de ancho, mantiene ratio
