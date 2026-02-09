# Dockerfile para el servidor Node.js/TypeScript
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente y configuración
COPY src ./src
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Imagen de producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código compilado desde el builder
COPY --from=builder /app/dist ./dist

# Crear directorios necesarios
RUN mkdir -p cache/videos temp

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=${PORT:-3000}

# Comando para iniciar el servidor
CMD ["npm", "start"]
