#!/bin/bash

# Script de inicialización para desarrollo - DevsProject
# Ejecuta app, dashboard-admin y server en paralelo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     DevsProject - Inicializador de Desarrollo          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${YELLOW}Uso: ./start-dev.sh [opciones]${NC}\n"
    echo -e "${GREEN}Opciones:${NC}"
    echo "  --skip-checks    Omite la verificación de dependencias"
    echo "  --help, -h       Muestra esta ayuda\n"
    echo -e "${GREEN}Ejemplos:${NC}"
    echo "  ./start-dev.sh"
    echo "  ./start-dev.sh --skip-checks\n"
    exit 0
}

# Parsear argumentos
SKIP_CHECKS=false
for arg in "$@"; do
    case $arg in
        --skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        --help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Opción desconocida: $arg${NC}"
            show_help
            ;;
    esac
done

# Banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     DevsProject - Inicializador de Desarrollo          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Verificar Node.js
if [ "$SKIP_CHECKS" = false ]; then
    echo -e "${YELLOW}[1/3] Verificando dependencias...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}  ✗ Node.js no está instalado o no está en el PATH${NC}"
        echo -e "${YELLOW}  Por favor, instala Node.js desde https://nodejs.org/${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}  ✓ Node.js instalado: $NODE_VERSION${NC}"
    
    # Verificar que existan los directorios
    for dir in app dashboard-admin server; do
        if [ ! -d "$dir" ]; then
            echo -e "${RED}  ✗ Directorio '$dir' no encontrado${NC}"
            exit 1
        fi
        echo -e "${GREEN}  ✓ Directorio '$dir' encontrado${NC}"
    done
    
    echo -e "\n${YELLOW}[2/3] Verificando node_modules...${NC}"
    
    for dir in app dashboard-admin server; do
        if [ ! -d "$dir/node_modules" ]; then
            echo -e "${YELLOW}  ⚠  node_modules no encontrado en '$dir'${NC}"
            echo -e "${YELLOW}  Ejecutando 'npm install' en '$dir'...${NC}"
            (cd "$dir" && npm install)
            echo -e "${GREEN}  ✓ Dependencias instaladas en '$dir'${NC}"
        else
            echo -e "${GREEN}  ✓ node_modules encontrado en '$dir'${NC}"
        fi
    done
fi

echo -e "\n${YELLOW}[3/3] Iniciando servicios...${NC}\n"

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n\n${YELLOW}Deteniendo todos los servicios...${NC}"
    jobs -p | xargs -r kill 2>/dev/null || true
    echo -e "${GREEN}✓ Todos los servicios detenidos${NC}"
    echo -e "\n${CYAN}¡Hasta luego! 👋${NC}\n"
    exit 0
}

# Registrar handler para Ctrl+C
trap cleanup SIGINT SIGTERM

# Configurar variables de entorno si no existen
export VITE_API_URL=${VITE_API_URL:-"http://localhost:3000/api"}
export VITE_BACKEND_URL=${VITE_BACKEND_URL:-"http://localhost:3000"}

# Función para ejecutar un servicio con colores
run_service() {
    local service_name=$1
    local service_dir=$2
    local color=$3
    
    cd "$service_dir" || exit 1
    
    # Ejecutar y agregar prefijo con color
    npm run dev 2>&1 | while IFS= read -r line; do
        timestamp=$(date +"%H:%M:%S")
        if [[ $line =~ error|Error|ERROR|failed|Failed ]]; then
            echo -e "${RED}[$timestamp] [$service_name] $line${NC}"
        elif [[ $line =~ warning|Warning|WARNING ]]; then
            echo -e "${YELLOW}[$timestamp] [$service_name] $line${NC}"
        elif [[ $line =~ ready|Ready|listening|Listening|Local: ]]; then
            echo -e "${GREEN}[$timestamp] [$service_name] $line${NC}"
        else
            echo -e "${color}[$timestamp] [$service_name] $line${NC}"
        fi
    done
}

# Iniciar servicios en background
echo -e "${CYAN}🚀 Iniciando Server (Backend)...${NC}"
run_service "SERVER" "server" "$CYAN" &
SERVER_PID=$!

sleep 1

echo -e "${CYAN}🚀 Iniciando App (Frontend)...${NC}"
run_service "APP" "app" "$CYAN" &
APP_PID=$!

sleep 1

echo -e "${CYAN}🚀 Iniciando Dashboard Admin...${NC}"
run_service "ADMIN" "dashboard-admin" "$CYAN" &
ADMIN_PID=$!

# Esperar un momento para que los servicios inicien
sleep 2

echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Servicios iniciados correctamente            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}\n"
echo -e "${YELLOW}📍 Servicios disponibles en:${NC}"
echo -e "${CYAN}   • Server:    http://localhost:3000${NC}"
echo -e "${CYAN}   • App:       http://localhost:5173${NC}"
echo -e "${CYAN}   • Dashboard: http://localhost:5175${NC}"
echo -e "\n${GRAY}💡 Presiona Ctrl+C para detener todos los servicios${NC}\n"

# Esperar a que todos los procesos terminen
wait
