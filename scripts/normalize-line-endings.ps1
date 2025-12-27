# Script PowerShell para normalizar los finales de línea en todos los archivos del proyecto

Write-Host "Normalizando finales de línea..." -ForegroundColor Green

# Obtener todos los archivos de texto
$files = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.json,*.css,*.md,*.yml,*.yaml,*.txt `
  -Exclude node_modules,.next,out,build | 
  Where-Object { $_.FullName -notmatch "node_modules|\.next|out|build" }

$count = 0
foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        # Normalizar a LF y asegurar que termine con newline
        $normalized = $content -replace "`r`n", "`n" -replace "`r", "`n"
        if (-not $normalized.EndsWith("`n")) {
            $normalized += "`n"
        }
        [System.IO.File]::WriteAllText($file.FullName, $normalized, [System.Text.UTF8Encoding]::new($false))
        $count++
    } catch {
        Write-Host "Error procesando $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "Finales de línea normalizados en $count archivos." -ForegroundColor Green

