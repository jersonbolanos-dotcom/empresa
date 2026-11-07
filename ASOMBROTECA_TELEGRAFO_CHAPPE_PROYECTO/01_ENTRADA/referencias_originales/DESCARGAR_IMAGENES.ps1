# Ejecutar desde PowerShell dentro de la carpeta descomprimida.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
py -3 .\descargar_imagenes.py
Write-Host "Si no funciona py, ejecuta: python descargar_imagenes.py"
