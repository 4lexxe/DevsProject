@echo off
REM Script para crear archivo .env desde env.example

if exist .env (
    echo El archivo .env ya existe.
    set /p overwrite="¿Deseas sobrescribirlo? (s/n): "
    if /i not "%overwrite%"=="s" (
        echo Operacion cancelada.
        exit /b 0
    )
)

if not exist env.example (
    echo Error: No se encontro el archivo env.example
    exit /b 1
)

copy env.example .env

echo Archivo .env creado desde env.example
echo.
echo IMPORTANTE: Edita el archivo .env y completa las siguientes variables REQUERIDAS:
echo    - CLIENT_URL
echo    - ADMIN_CLIENT_URL
echo    - VITE_API_URL
echo    - SESSION_SECRET
echo.
echo Puedes generar un SESSION_SECRET seguro con PowerShell:
echo    [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
