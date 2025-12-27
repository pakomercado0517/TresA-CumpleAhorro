#!/bin/bash
# Script para normalizar los finales de línea en todos los archivos del proyecto

echo "Normalizando finales de línea..."

# Normalizar todos los archivos de texto
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.txt" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./out/*" \
  ! -path "./build/*" \
  -exec dos2unix {} + 2>/dev/null || \
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.txt" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./out/*" \
  ! -path "./build/*" \
  -exec sed -i '' 's/\r$//' {} + 2>/dev/null || \
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.txt" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./out/*" \
  ! -path "./build/*" \
  -exec perl -pi -e 's/\r\n?/\n/g' {} +

echo "Finales de línea normalizados."

