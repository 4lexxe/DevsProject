@echo off
REM Script de inicialización para desarrollo - DevsProject (Windows CMD)
REM Ejecuta app, dashboard-admin y server en paralelo

setlocal enabledelayedexpansion

REM Banner
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     DevsProject - Inicializador de Desarrollo          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado o no está en el PATH
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js instalado: %NODE_VERSION%

REM Verificar directorios
if not exist "app" (
    echo [ERROR] Directorio 'app' no encontrado
    pause
    exit /b 1
)
if not exist "dashboard-admin" (
    echo [ERROR] Directorio 'dashboard-admin' no encontrado
    pause
    exit /b 1
)
if not exist "server" (
    echo [ERROR] Directorio 'server' no encontrado
    pause
    exit /b 1
)

echo.
echo [INFO] Iniciando servicios...
echo.

REM Configurar variables de entorno
if "%VITE_API_URL%"=="" set VITE_API_URL=http://localhost:3000/api
if "%VITE_BACKEND_URL%"=="" set VITE_BACKEND_URL=http://localhost:3000

REM Iniciar Server en nueva ventana
echo [SERVER] Iniciando backend...
start "DevsProject - Server" cmd /k "cd server && npm run dev"

REM Esperar un momento
timeout /t 2 /nobreak >nul

REM Iniciar App en nueva ventana
echo [APP] Iniciando frontend...
start "DevsProject - App" cmd /k "cd app && npm run dev"

REM Esperar un momento
timeout /t 2 /nobreak >nul

REM Iniciar Dashboard Admin en nueva ventana
echo [ADMIN] Iniciando dashboard admin...
start "DevsProject - Dashboard Admin" cmd /k "cd dashboard-admin && npm run dev"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║           Servicios iniciados correctamente            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo [INFO] Servicios disponibles en:
echo    • Server:    http://localhost:3000
echo    • App:       http://localhost:5173
echo    • Dashboard: http://localhost:5175
echo.
echo [INFO] Cada servicio se ejecuta en su propia ventana
echo [INFO] Cierra las ventanas individualmente para detener los servicios
echo.
pause
