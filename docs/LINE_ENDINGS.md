# Configuración de Finales de Línea

Este proyecto está configurado para usar finales de línea consistentes (LF - Line Feed) en todos los archivos de texto.

## Archivos de Configuración

### `.gitattributes`
Este archivo le dice a Git cómo manejar los finales de línea:
- Todos los archivos de texto usan `LF` (Unix-style)
- Los archivos binarios se mantienen sin cambios

### `.editorconfig`
Este archivo configura los editores para:
- Usar `LF` como final de línea
- Insertar un salto de línea al final de cada archivo
- Eliminar espacios en blanco al final de las líneas
- Usar UTF-8 como codificación

## Normalizar Archivos Existentes

Si tienes archivos con finales de línea inconsistentes, puedes normalizarlos usando:

### Opción 1: Script de Node.js (Recomendado)
```bash
pnpm run normalize
```

### Opción 2: Script de PowerShell (Windows)
```powershell
.\scripts\normalize-line-endings.ps1
```

### Opción 3: Script de Bash (Linux/Mac)
```bash
chmod +x scripts/normalize-line-endings.sh
./scripts/normalize-line-endings.sh
```

### Opción 4: Usar Git para normalizar
```bash
# Normalizar todos los archivos en el repositorio
git add --renormalize .
```

## Configuración de Git

El proyecto está configurado con:
- `core.autocrlf = false` - No convierte automáticamente los finales de línea
- `core.eol = lf` - Usa LF como final de línea por defecto

Estos valores se configuran automáticamente cuando clonas el repositorio gracias a `.gitattributes`.

## Verificar Finales de Línea

Para verificar qué tipo de finales de línea tienen tus archivos:

### Windows (PowerShell)
```powershell
Get-Content archivo.tsx -Raw | Select-String -Pattern "`r`n"
```

### Linux/Mac
```bash
file archivo.tsx
# o
cat -A archivo.tsx | grep -E '\r|\\r'
```

## Solución de Problemas

Si sigues viendo diferencias en Git después de normalizar:

1. **Asegúrate de que `.gitattributes` está en el repositorio:**
   ```bash
   git add .gitattributes
   git commit -m "Agregar configuración de finales de línea"
   ```

2. **Normaliza todos los archivos:**
   ```bash
   pnpm run normalize
   git add --renormalize .
   ```

3. **Verifica la configuración de Git:**
   ```bash
   git config core.autocrlf
   git config core.eol
   ```

4. **Si es necesario, configura Git manualmente:**
   ```bash
   git config core.autocrlf false
   git config core.eol lf
   ```

## IDE/Editor

La mayoría de los editores modernos respetan `.editorconfig` automáticamente:
- **VS Code**: Instala la extensión "EditorConfig for VS Code"
- **WebStorm/IntelliJ**: Soporte nativo
- **Sublime Text**: Instala el paquete "EditorConfig"
- **Vim**: Instala el plugin "editorconfig-vim"

