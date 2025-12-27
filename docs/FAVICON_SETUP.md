# Configuración del Favicon

## Estado Actual

El proyecto tiene configurado el favicon en `app/layout.tsx` con soporte para múltiples tamaños.

## Archivos Necesarios

Para que el favicon funcione correctamente, necesitas crear los siguientes archivos en la carpeta `public/`:

1. **`favicon.ico`** - Favicon estándar (16x16, 32x32, 48x48)
2. **`icon-16x16.png`** - Icono de 16x16 píxeles
3. **`icon-32x32.png`** - Icono de 32x32 píxeles
4. **`apple-icon.png`** - Icono para dispositivos Apple (180x180 píxeles)

## Cómo Crear el Favicon desde el Logo

### Opción 1: Script Automático (Recomendado) ⚡

El proyecto incluye un script que genera automáticamente todos los favicons desde el logo SVG:

1. **Instala las dependencias necesarias:**

   ```bash
   pnpm add -D sharp to-ico
   ```

2. **Ejecuta el script:**
   ```bash
   pnpm run generate-favicons
   ```

El script generará automáticamente:

- `favicon.ico` (con tamaños 16x16, 32x32, 48x48)
- `icon-16x16.png`
- `icon-32x32.png`
- `apple-icon.png` (180x180)

Todos los archivos se crearán en la carpeta `public/` basándose en `public/tresa-brand-green.svg`.

### Opción 2: Herramientas Online

1. **RealFaviconGenerator** (https://realfavicongenerator.net/)

   - Sube tu logo (`tresa-brand-green.svg` o una imagen PNG)
   - Genera todos los tamaños necesarios
   - Descarga el paquete completo
   - Copia los archivos a `public/`

2. **Favicon.io** (https://favicon.io/)
   - Convierte texto o imagen a favicon
   - Genera múltiples formatos

### Opción 2: Desde el Logo SVG

Si quieres usar el logo verde de TresA Design:

1. **Convierte SVG a PNG** (usando herramientas como Inkscape, GIMP, o online):

   - Abre `public/tresa-brand-green.svg`
   - Exporta a PNG en los siguientes tamaños:
     - 16x16 px → `icon-16x16.png`
     - 32x32 px → `icon-32x32.png`
     - 180x180 px → `apple-icon.png`

2. **Crea el favicon.ico**:
   - Usa una herramienta como [ICO Convert](https://icoconvert.com/)
   - O usa ImageMagick: `convert icon-32x32.png favicon.ico`

### Opción 3: Usar el Logo Verde Directamente

Puedes usar el logo verde de TresA Design como base:

```bash
# Si tienes ImageMagick instalado
convert public/tresa-brand-green.svg -resize 32x32 public/icon-32x32.png
convert public/tresa-brand-green.svg -resize 16x16 public/icon-16x16.png
convert public/tresa-brand-green.svg -resize 180x180 public/apple-icon.png
convert public/icon-32x32.png public/favicon.ico
```

## Verificación

Después de agregar los archivos:

1. **Reinicia el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

2. **Verifica en el navegador:**

   - Abre la aplicación
   - Revisa la pestaña del navegador (debería mostrar el favicon)
   - Inspecciona el código fuente (Ctrl+U) y busca las etiquetas `<link rel="icon">`

3. **Verifica en las herramientas de desarrollo:**
   - Abre DevTools (F12)
   - Ve a la pestaña "Network"
   - Recarga la página
   - Busca las peticiones de `favicon.ico`, `icon-*.png`, etc.

## Configuración Actual

El favicon está configurado en `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};
```

## Notas Importantes

- Los archivos deben estar en la carpeta `public/`, no en `app/`
- El `favicon.ico` es el más importante y debe existir
- Los iconos PNG son opcionales pero mejoran la calidad en diferentes dispositivos
- El `apple-icon.png` es necesario para que iOS muestre el icono correctamente cuando se agrega a la pantalla de inicio

## Troubleshooting

Si el favicon no aparece:

1. **Limpia la caché del navegador:**

   - Chrome: Ctrl+Shift+Delete → Limpiar caché
   - O abre en modo incógnito

2. **Verifica que los archivos existan:**

   ```bash
   ls -la public/favicon.ico
   ls -la public/icon-*.png
   ```

3. **Verifica la ruta en el código:**

   - Las rutas deben empezar con `/` (ej: `/favicon.ico`)
   - No deben incluir `public/` en la ruta

4. **Reinicia el servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   pnpm dev
   ```
