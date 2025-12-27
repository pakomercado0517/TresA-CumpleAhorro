#!/usr/bin/env node

/**
 * Script para generar favicons desde el logo SVG de TresA Design
 * Genera: favicon.ico, icon-16x16.png, icon-32x32.png, apple-icon.png
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

const SVG_PATH = path.join(__dirname, "..", "public", "tresa-brand-green.svg");
const OUTPUT_DIR = path.join(__dirname, "..", "public");

// Tamaños de iconos a generar
const ICON_SIZES = [
  { name: "icon-16x16.png", size: 16 },
  { name: "icon-32x32.png", size: 32 },
  { name: "apple-icon.png", size: 180 },
];

async function generateFavicons() {
  try {
    // Verificar que el SVG existe
    if (!fs.existsSync(SVG_PATH)) {
      console.error(`❌ Error: No se encontró el archivo ${SVG_PATH}`);
      process.exit(1);
    }

    console.log("🎨 Generando favicons desde el logo de TresA Design...\n");

    // Generar iconos PNG
    const pngBuffers = [];

    for (const icon of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, icon.name);
      
      await sharp(SVG_PATH)
        .resize(icon.size, icon.size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Fondo transparente
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generado: ${icon.name} (${icon.size}x${icon.size}px)`);

      // Guardar el buffer de 32x32 para el favicon.ico
      if (icon.size === 32) {
        const buffer = await sharp(SVG_PATH)
          .resize(32, 32, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .png()
          .toBuffer();
        pngBuffers.push(buffer);
      }
    }

    // Generar favicon.ico con múltiples tamaños
    console.log("\n📦 Generando favicon.ico...");

    const faviconSizes = [16, 32, 48];
    const faviconBuffers = [];

    for (const size of faviconSizes) {
      const buffer = await sharp(SVG_PATH)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();
      faviconBuffers.push(buffer);
    }

    const icoBuffer = await toIco(faviconBuffers);
    const faviconPath = path.join(OUTPUT_DIR, "favicon.ico");
    fs.writeFileSync(faviconPath, icoBuffer);

    console.log(`✅ Generado: favicon.ico (${faviconSizes.join(", ")}px)`);

    // Copiar favicon.ico a app/ para que Next.js 13+ lo use automáticamente
    const appDir = path.join(__dirname, "..", "app");
    const appFaviconPath = path.join(appDir, "favicon.ico");
    fs.copyFileSync(faviconPath, appFaviconPath);
    console.log(`✅ Copiado: favicon.ico a app/ (Next.js 13+ usa este)`);

    console.log("\n✨ ¡Favicons generados exitosamente!");
    console.log("\n📁 Archivos generados:");
    console.log("   - public/favicon.ico");
    console.log("   - app/favicon.ico (para Next.js 13+)");
    ICON_SIZES.forEach((icon) => {
      console.log(`   - public/${icon.name}`);
    });
    console.log("\n💡 Reinicia el servidor de desarrollo para ver los cambios.");

  } catch (error) {
    console.error("❌ Error al generar favicons:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
generateFavicons();

