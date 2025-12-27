# Scripts del Proyecto

## Generar Favicons

Este script genera automáticamente todos los favicons necesarios desde el logo SVG de TresA Design.

### Instalación de Dependencias

Primero, instala las dependencias necesarias:

```bash
pnpm add -D sharp to-ico
```

### Ejecución

Ejecuta el script:

```bash
pnpm run generate-favicons
```

O directamente:

```bash
node scripts/generate-favicons.js
```

### Archivos Generados

El script generará los siguientes archivos en la carpeta `public/`:

- `favicon.ico` - Favicon estándar (contiene múltiples tamaños: 16x16, 32x32, 48x48)
- `icon-16x16.png` - Icono de 16x16 píxeles
- `icon-32x32.png` - Icono de 32x32 píxeles
- `apple-icon.png` - Icono para dispositivos Apple (180x180 píxeles)

### Requisitos

- El archivo `public/tresa-brand-green.svg` debe existir
- Node.js instalado
- Las dependencias `sharp` y `to-ico` instaladas

### Notas

- Los iconos se generan con fondo transparente
- El logo se escala manteniendo su proporción (fit: contain)
- Después de generar los favicons, reinicia el servidor de desarrollo

