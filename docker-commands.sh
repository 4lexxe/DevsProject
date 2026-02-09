#!/bin/bash

# Script de ayuda para comandos Docker comunes

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}Comandos Docker disponibles para DevsProject:${NC}\n"
    echo "  build          - Construir todas las imágenes"
    echo "  up             - Iniciar todos los servicios"
    echo "  down           - Detener todos los servicios"
    echo "  restart        - Reiniciar todos los servicios"
    echo "  logs           - Ver logs de todos los servicios"
    echo "  logs-server    - Ver logs del servidor"
    echo "  logs-app       - Ver logs de la app frontend"
    echo "  logs-admin     - Ver logs del dashboard admin"
    echo "  logs-db        - Ver logs de PostgreSQL"
    echo "  shell-server   - Abrir shell en el contenedor del servidor"
    echo "  shell-db        - Abrir shell en PostgreSQL"
    echo "  db-connect     - Conectar a la base de datos"
    echo "  clean          - Limpiar contenedores, volúmenes e imágenes"
    echo "  rebuild        - Reconstruir todo desde cero"
    echo "  status         - Ver estado de los servicios"
    echo "  help           - Mostrar esta ayuda"
}

# Función para construir
build() {
    echo -e "${GREEN}Construyendo imágenes...${NC}"
    docker-compose build
}

# Función para iniciar
up() {
    echo -e "${GREEN}Iniciando servicios...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Servicios iniciados!${NC}"
    echo -e "${BLUE}API: http://localhost:3000${NC}"
    echo -e "${BLUE}App: http://localhost:5173${NC}"
    echo -e "${BLUE}Admin: http://localhost:5175${NC}"
}

# Función para detener
down() {
    echo -e "${YELLOW}Deteniendo servicios...${NC}"
    docker-compose down
}

# Función para reiniciar
restart() {
    echo -e "${YELLOW}Reiniciando servicios...${NC}"
    docker-compose restart
}

# Función para logs
logs() {
    docker-compose logs -f
}

logs_server() {
    docker-compose logs -f server
}

logs_app() {
    docker-compose logs -f app
}

logs_admin() {
    docker-compose logs -f dashboard-admin
}

logs_db() {
    docker-compose logs -f postgres
}

# Función para shell del servidor
shell_server() {
    docker-compose exec server sh
}

# Función para shell de la base de datos
shell_db() {
    docker-compose exec postgres sh
}

# Función para conectar a la base de datos
db_connect() {
    docker-compose exec postgres psql -U postgres -d devsproject
}

# Función para limpiar
clean() {
    echo -e "${YELLOW}Limpiando contenedores, volúmenes e imágenes...${NC}"
    read -p "¿Estás seguro? Esto eliminará todos los datos (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose rm -f
        echo -e "${GREEN}Limpieza completada${NC}"
    else
        echo -e "${BLUE}Operación cancelada${NC}"
    fi
}

# Función para reconstruir
rebuild() {
    echo -e "${YELLOW}Reconstruyendo todo desde cero...${NC}"
    docker-compose down -v
    docker-compose build --no-cache
    docker-compose up -d
    echo -e "${GREEN}Reconstrucción completada${NC}"
}

# Función para estado
status() {
    echo -e "${BLUE}Estado de los servicios:${NC}"
    docker-compose ps
}

# Main
case "$1" in
    build)
        build
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    logs-server)
        logs_server
        ;;
    logs-app)
        logs_app
        ;;
    logs-admin)
        logs_admin
        ;;
    logs-db)
        logs_db
        ;;
    shell-server)
        shell_server
        ;;
    shell-db)
        shell_db
        ;;
    db-connect)
        db_connect
        ;;
    clean)
        clean
        ;;
    rebuild)
        rebuild
        ;;
    status)
        status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${YELLOW}Comando no reconocido: $1${NC}\n"
        show_help
        exit 1
        ;;
esac
