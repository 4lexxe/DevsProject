# 🚀 Inicio Rápido - DevsProject

## Opción Más Rápida (Recomendada)

### Windows
```powershell
.\start-dev.ps1
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## ¿Qué hace el script?

✅ Verifica que Node.js esté instalado  
✅ Verifica que existan los directorios necesarios  
✅ Instala dependencias automáticamente si faltan  
✅ Inicia los 3 servicios en paralelo:
   - 🖥️ Server (Backend) en http://localhost:3000
   - 🎨 App (Frontend) en http://localhost:5173
   - 📊 Dashboard Admin en http://localhost:5175

## Requisitos Previos

- Node.js 18+ instalado
- npm 9+ instalado
- PostgreSQL ejecutándose (para el servidor)

## Alternativa: Usando npm

```bash
# 1. Instalar dependencias de la raíz
npm install

# 2. Instalar dependencias de todos los servicios
npm run install:all

# 3. Iniciar todos los servicios
npm run dev
```

## Más Información

- [Guía de Desarrollo Completa](./README-DEV.md)
- [Guía de Docker](./DOCKER.md)
