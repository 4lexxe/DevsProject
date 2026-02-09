# Dockerfile para el dashboard admin (Vite/React)
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Argumentos de build (variables de entorno para Vite)
ARG VITE_API_URL

# Variables de entorno para Vite (necesarias en build time)
ENV VITE_API_URL=${VITE_API_URL}

# Validar que las variables requeridas estén definidas
RUN if [ -z "$VITE_API_URL" ]; then \
      echo "ERROR: VITE_API_URL no está definida. Debe proporcionarse como build arg." && \
      exit 1; \
    fi

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente y archivos estáticos
COPY src ./src
COPY public ./public
COPY index.html ./

# Construir la aplicación
RUN npm run build

# Imagen de producción con Nginx
FROM nginx:alpine AS production

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
