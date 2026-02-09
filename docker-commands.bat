@echo off
REM Script de ayuda para comandos Docker comunes (Windows)

setlocal

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="--help" goto help
if "%1"=="-h" goto help
if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="down" goto down
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="logs-server" goto logs_server
if "%1"=="logs-app" goto logs_app
if "%1"=="logs-admin" goto logs_admin
if "%1"=="logs-db" goto logs_db
if "%1"=="shell-server" goto shell_server
if "%1"=="shell-db" goto shell_db
if "%1"=="db-connect" goto db_connect
if "%1"=="clean" goto clean
if "%1"=="rebuild" goto rebuild
if "%1"=="status" goto status

echo Comando no reconocido: %1
goto help

:help
echo.
echo Comandos Docker disponibles para DevsProject:
echo.
echo   build          - Construir todas las imagenes
echo   up             - Iniciar todos los servicios
echo   down           - Detener todos los servicios
echo   restart        - Reiniciar todos los servicios
echo   logs           - Ver logs de todos los servicios
echo   logs-server    - Ver logs del servidor
echo   logs-app       - Ver logs de la app frontend
echo   logs-admin     - Ver logs del dashboard admin
echo   logs-db        - Ver logs de PostgreSQL
echo   shell-server   - Abrir shell en el contenedor del servidor
echo   shell-db       - Abrir shell en PostgreSQL
echo   db-connect     - Conectar a la base de datos
echo   clean          - Limpiar contenedores, volumenes e imagenes
echo   rebuild        - Reconstruir todo desde cero
echo   status         - Ver estado de los servicios
echo   help           - Mostrar esta ayuda
echo.
goto end

:build
echo Construyendo imagenes...
docker-compose build
goto end

:up
echo Iniciando servicios...
docker-compose up -d
echo Servicios iniciados!
echo API: http://localhost:3000
echo App: http://localhost:5173
echo Admin: http://localhost:5175
goto end

:down
echo Deteniendo servicios...
docker-compose down
goto end

:restart
echo Reiniciando servicios...
docker-compose restart
goto end

:logs
docker-compose logs -f
goto end

:logs_server
docker-compose logs -f server
goto end

:logs_app
docker-compose logs -f app
goto end

:logs_admin
docker-compose logs -f dashboard-admin
goto end

:logs_db
docker-compose logs -f postgres
goto end

:shell_server
docker-compose exec server sh
goto end

:shell_db
docker-compose exec postgres sh
goto end

:db_connect
docker-compose exec postgres psql -U postgres -d devsproject
goto end

:clean
echo Limpiando contenedores, volumenes e imagenes...
echo ADVERTENCIA: Esto eliminara todos los datos
set /p confirm="¿Estás seguro? (s/n): "
if /i "%confirm%"=="s" (
    docker-compose down -v
    docker-compose rm -f
    echo Limpieza completada
) else (
    echo Operacion cancelada
)
goto end

:rebuild
echo Reconstruyendo todo desde cero...
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
echo Reconstruccion completada
goto end

:status
echo Estado de los servicios:
docker-compose ps
goto end

:end
endlocal
