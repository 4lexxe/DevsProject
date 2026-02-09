# Guía de Docker para DevsProject

Esta guía explica cómo ejecutar el proyecto completo usando Docker y Docker Compose.

## Requisitos Previos

- Docker Desktop instalado (o Docker Engine + Docker Compose)
- Al menos 4GB de RAM disponibles
- Puertos disponibles: 3000, 5173, 5175, 5432

## Estructura del Proyecto

El proyecto está compuesto por los siguientes servicios:

1. **postgres**: Base de datos PostgreSQL
2. **server**: API Backend (Node.js/Express/TypeScript)
3. **app**: Aplicación Frontend Principal (React/Vite)
4. **dashboard-admin**: Dashboard de Administración (React/Vite)

## Configuración Inicial

### 1. Crear archivo `.env`

**⚠️ IMPORTANTE**: Copia el archivo `env.example` a `.env` y completa los valores:

```bash
cp env.example .env
```

Luego edita el archivo `.env` y completa las siguientes variables **REQUERIDAS**:

Las variables **REQUERIDAS** son:

- `CLIENT_URL`: URL completa donde se servirá la app frontend (ej: `http://localhost:5173`)
- `ADMIN_CLIENT_URL`: URL completa donde se servirá el dashboard admin (ej: `http://localhost:5175`)
- `VITE_API_URL`: URL completa de la API backend (ej: `http://localhost:3000/api`)
- `SESSION_SECRET`: Clave secreta para las sesiones (genera una con: `openssl rand -base64 32`)

**⚠️ IMPORTANTE**: 
- Todas las URLs deben ser completas (con protocolo http:// o https://)
- `VITE_API_URL` debe incluir `/api` al final si tu API está bajo ese path
- `SESSION_SECRET` debe ser una clave secreta segura y única
- Para producción, usa URLs reales de tu dominio

Ver el archivo `env.example` para todas las variables disponibles.

## Comandos Docker

### Construir y ejecutar todos los servicios

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f server
docker-compose logs -f app
docker-compose logs -f dashboard-admin
docker-compose logs -f postgres
```

### Detener los servicios

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ Esto eliminará la base de datos)
docker-compose down -v
```

### Reconstruir un servicio específico

```bash
# Reconstruir solo el servidor
docker-compose build server
docker-compose up -d server

# Reconstruir solo la app frontend
docker-compose build app
docker-compose up -d app
```

### Ejecutar comandos dentro de los contenedores

```bash
# Acceder al contenedor del servidor
docker-compose exec server sh

# Ejecutar comandos npm en el servidor
docker-compose exec server npm run sync

# Acceder a la base de datos PostgreSQL
docker-compose exec postgres psql -U postgres -d devsproject
```

## Acceso a los Servicios

Una vez que todos los servicios estén ejecutándose:

- **API Backend**: http://localhost:3000
- **App Frontend**: http://localhost:5173
- **Dashboard Admin**: http://localhost:5175
- **PostgreSQL**: localhost:5432

## Inicialización de la Base de Datos

Después de iniciar los servicios por primera vez, es posible que necesites ejecutar scripts de inicialización:

```bash
# Ejecutar scripts de sincronización
docker-compose exec server npm run sync

# Crear super usuario inicial
docker-compose exec server npm run create-super-user
```

## Desarrollo Local con Docker

Si prefieres desarrollar localmente pero usar Docker solo para la base de datos:

```bash
# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Luego ejecutar los servicios localmente
# En terminal 1: server
cd server && npm run dev

# En terminal 2: app
cd app && npm run dev

# En terminal 3: dashboard-admin
cd dashboard-admin && npm run dev
```

## Solución de Problemas

### El servidor no puede conectarse a la base de datos

1. Verifica que PostgreSQL esté ejecutándose: `docker-compose ps`
2. Verifica las variables de entorno en `.env`
3. Revisa los logs: `docker-compose logs postgres`

### Los frontends no pueden conectarse al servidor

1. Verifica que `VITE_API_URL` esté configurado correctamente
2. Asegúrate de que el servidor esté ejecutándose: `docker-compose ps`
3. Revisa los logs del servidor: `docker-compose logs server`

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes construidas
docker-compose rm -f

# Reconstruir todo desde cero
docker-compose build --no-cache
docker-compose up -d
```

## Producción

Para producción, considera:

1. **Usar un proxy reverso** (Nginx o Traefik) delante de los servicios
2. **Configurar SSL/TLS** con certificados válidos
3. **Usar secretos de Docker** para variables sensibles
4. **Configurar backups** de la base de datos
5. **Monitoreo y logging** (ej: Prometheus, Grafana)
6. **Escalado horizontal** si es necesario

## Volúmenes Persistentes

Los siguientes datos se almacenan en volúmenes de Docker:

- `postgres_data`: Base de datos PostgreSQL
- `./server/cache`: Cache de videos del servidor
- `./server/temp`: Archivos temporales del servidor

Estos volúmenes persisten incluso si eliminas los contenedores (a menos que uses `docker-compose down -v`).

## Recursos Adicionales

- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Documentación de Docker](https://docs.docker.com/)
- [PostgreSQL en Docker](https://hub.docker.com/_/postgres)
