# Guía de Desarrollo - DevsProject

Esta guía explica cómo iniciar el proyecto en modo desarrollo.

## 🚀 Inicio Rápido

### Opción 1: Scripts de Inicialización (Recomendado)

#### Windows (PowerShell - Recomendado)
```powershell
.\start-dev.ps1
```

#### Windows (CMD)
```cmd
start-dev.bat
```

#### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Opción 2: Usando npm (Requiere instalación de dependencias)

Primero, instala las dependencias en la raíz:
```bash
npm install
```

Luego, inicia todos los servicios:
```bash
npm run dev
```

### Opción 3: Manual

Abre 3 terminales y ejecuta en cada una:

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - App:**
```bash
cd app
npm run dev
```

**Terminal 3 - Dashboard Admin:**
```bash
cd dashboard-admin
npm run dev
```

## 📍 URLs de los Servicios

Una vez iniciados, los servicios estarán disponibles en:

- **Server (Backend)**: http://localhost:3000
- **App (Frontend)**: http://localhost:5173
- **Dashboard Admin**: http://localhost:5175

## 🔧 Configuración

### Variables de Entorno

Para desarrollo local, asegúrate de tener un archivo `.env` en la raíz del proyecto o configurar las siguientes variables:

```env
# Backend
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devsproject
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
SESSION_SECRET=tu-clave-secreta-aqui

# Frontend
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000

# URLs de CORS
CLIENT_URL=http://localhost:5173
ADMIN_CLIENT_URL=http://localhost:5175
```

### Instalación de Dependencias

Si es la primera vez que ejecutas el proyecto:

```bash
# Instalar dependencias de todos los servicios
npm run install:all

# O manualmente:
cd server && npm install
cd ../app && npm install
cd ../dashboard-admin && npm install
```

## 🛠️ Scripts Disponibles

### Scripts de la Raíz (package.json)

- `npm run dev` - Inicia todos los servicios en paralelo
- `npm run dev:server` - Solo inicia el servidor
- `npm run dev:app` - Solo inicia la app frontend
- `npm run dev:admin` - Solo inicia el dashboard admin
- `npm run install:all` - Instala dependencias de todos los servicios
- `npm run build:all` - Construye todos los servicios
- `npm run lint:all` - Ejecuta linters en todos los servicios

### Scripts del Servidor

- `npm run dev` - Inicia en modo desarrollo con nodemon
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia en modo producción
- `npm run sync` - Ejecuta scripts de sincronización de base de datos

### Scripts de App y Dashboard Admin

- `npm run dev` - Inicia servidor de desarrollo Vite
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta ESLint

## 🐛 Solución de Problemas

### Los servicios no inician

1. **Verifica que Node.js esté instalado:**
   ```bash
   node --version
   npm --version
   ```

2. **Verifica que las dependencias estén instaladas:**
   ```bash
   ls server/node_modules
   ls app/node_modules
   ls dashboard-admin/node_modules
   ```

3. **Reinstala las dependencias:**
   ```bash
   npm run install:all
   ```

### Error de conexión a la base de datos

1. **Verifica que PostgreSQL esté ejecutándose:**
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Verifica las variables de entorno en `.env`**

3. **Verifica que la base de datos exista:**
   ```bash
   psql -U postgres -l
   ```

### Puerto ya en uso

Si un puerto está en uso, puedes:

1. **Detener el proceso que usa el puerto:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. **Cambiar el puerto en la configuración:**
   - Server: Edita `server/src/index.ts` o usa variable `PORT`
   - App: Edita `app/vite.config.ts`
   - Dashboard: Edita `dashboard-admin/vite.config.ts`

## 📝 Notas

- Los scripts de inicialización verifican automáticamente las dependencias
- Los logs se muestran con colores para facilitar la lectura
- Presiona `Ctrl+C` para detener todos los servicios (en scripts avanzados)
- Cada servicio se ejecuta en su propio proceso

## 🔗 Enlaces Útiles

- [Documentación de Docker](./DOCKER.md) - Para ejecutar con Docker
- [Guía de Contribución](./CONTRIBUTING.md) - Si existe
- [Documentación de la API](./docs/API.md) - Si existe
