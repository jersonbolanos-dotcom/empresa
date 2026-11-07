$ErrorActionPreference = 'Continue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $here 'referencias_originales'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$assets = Get-Content (Join-Path $here 'MANIFIESTO_IMAGENES.json') -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($asset in $assets) {
  $target = Join-Path $out $asset.filename
  try {
    Invoke-WebRequest -Uri $asset.url -OutFile $target -UseBasicParsing -Headers @{ 'User-Agent'='Mozilla/5.0 (Asombroteca Media Importer)' } -ErrorAction Stop
    if ((Get-Item $target).Length -lt 1000) { throw 'Archivo demasiado pequeno' }
    Write-Host "OK: $($asset.filename)" -ForegroundColor Green
  } catch {
    Write-Host "Error: $($asset.filename) - $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Abre manualmente: $($asset.source)"
  }
}
Write-Host "Revisa la carpeta: $out"
