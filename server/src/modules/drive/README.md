# Módulo Google Drive - Gestión de Archivos con Control de Acceso

## 🔐 Descripción General

Este módulo proporciona integración completa con Google Drive API para gestionar archivos educativos con un sistema robusto de permisos basado en roles. Está diseñado para que una **sola cuenta de Google Drive** sea administrada por el sistema, mientras que los usuarios acceden a archivos compartidos según sus permisos específicos.

## 🎯 Modelo de Seguridad - Concepto Clave

### ¿Cómo funciona el control de acceso?

**Una cuenta de Drive centralizada**: El sistema usa una única cuenta de Google Drive del administrador, pero los usuarios tienen diferentes niveles de acceso:

- 🔑 **Administradores**: Control total - pueden crear, editar, eliminar archivos
- 👥 **Editores**: Pueden subir y modificar contenido educativo
- 📚 **Contribuidores**: Pueden subir tareas y proyectos pequeños
- 👁️ **Visualizadores**: Solo pueden acceder a enlaces compartidos

### Permisos Granulares

| Rol | Permisos | Límites de Archivo | Cuota Diaria | Casos de Uso |
|-----|----------|-------------------|--------------|--------------|
| **VIEWER** | `drive:read` | Solo descarga | - | Estudiantes viendo material |
| **CONTRIBUTOR** | `read` + `upload` | 10MB | 100MB | Estudiantes subiendo tareas |
| **EDITOR** | `read` + `upload` + `edit` | 50MB | 500MB | Instructores gestionando contenido |
| **MODERATOR** | `read` + `upload` + `edit` + `delete` | 200MB | 2GB | Coordinadores de curso |
| **ADMIN** | Todos los permisos | Sin límites | Sin límites | Administradores del sistema |

## 📋 Características Implementadas

- ✅ **Control de acceso basado en roles** con permisos granulares
- ✅ **Gestión completa de archivos** (CRUD con autorización)
- ✅ **Enlaces públicos compartidos** para contenido educativo
- ✅ **Límites por usuario** según rol asignado
- ✅ **Auditoría completa** de todas las operaciones
- ✅ **Validaciones robustas** de archivos y seguridad
- ✅ **Cuotas diarias** por tipo de usuario
- ✅ **Middleware de autorización** reutilizable
- ✅ **API REST completa** con documentación
- ✅ **Gestión de permisos** para administradores

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install googleapis multer
```

### 2. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Google Drive API Configuration
GOOGLE_DRIVE_CLIENT_ID=tu_client_id_aqui
GOOGLE_DRIVE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_DRIVE_REFRESH_TOKEN=tu_refresh_token_aqui

# Opcional: Carpeta raíz para organizar archivos
GOOGLE_DRIVE_FOLDER_ID=id_de_carpeta_opcional
```

### Obtener Credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google Drive API
4. Crea credenciales OAuth 2.0
5. Configura las URLs de redirección autorizadas
6. Obtén el refresh token usando el flujo OAuth

### Instalación de Dependencias

```bash
npm install googleapis multer @types/multer
```

## 📚 Uso del Módulo

### Importación

```typescript
import { 
  DriveService, 
  DriveController, 
  driveRoutes,
  handleSingleFileUpload,
  handleMultipleFileUpload 
} from './modules/drive';
```

### Rutas Disponibles

```typescript
// En tu app principal
app.use('/api/drive', driveRoutes);
```

#### Endpoints Disponibles:

**Subida de Archivos:**
- `POST /api/drive/upload` - Subir archivo único
- `POST /api/drive/upload/multiple` - Subir múltiples archivos

**Gestión de Archivos:**
- `GET /api/drive/files/:fileId` - Obtener información de archivo
- `PUT /api/drive/files/:fileId` - Actualizar metadatos
- `DELETE /api/drive/files/:fileId` - Eliminar archivo
- `GET /api/drive/files` - Listar archivos

**Organización:**
- `POST /api/drive/folders` - Crear carpeta
- `POST /api/drive/files/:fileId/move` - Mover archivo

**Visibilidad:**
- `POST /api/drive/files/:fileId/visibility` - Cambiar visibilidad

**Utilidades:**
- `GET /api/drive/search` - Buscar archivos
- `GET /api/drive/storage` - Información de almacenamiento
- `GET /api/drive/allowed-types` - Tipos de archivo permitidos

## 💻 Ejemplos de Uso

### Subir un Archivo

```typescript
// Frontend (FormData)
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'mi-archivo.pdf');
formData.append('description', 'Documento importante');
formData.append('makePublic', 'true');

const response = await fetch('/api/drive/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

### Usar el Servicio Directamente

```typescript
import { DriveService } from './modules/drive';

const driveService = new DriveService();

// Subir archivo
const uploadResult = await driveService.uploadFile(
  fileBuffer,
  'application/pdf',
  {
    name: 'documento.pdf',
    description: 'Mi documento',
    makePublic: true
  }
);

// Listar archivos
const files = await driveService.listFiles();

// Buscar archivos
const searchResults = await driveService.searchFiles('documento');
```

### Usar Middleware en Otras Rutas

```typescript
import { handleSingleFileUpload } from './modules/drive';

// En tus propias rutas
router.post('/mi-endpoint-con-archivo',
  ...handleSingleFileUpload,
  async (req: FileUploadRequest, res: Response) => {
    // req.driveFile contiene el archivo procesado
    // req.driveService contiene la instancia del servicio
    
    const result = await req.driveService!.uploadFile(
      req.driveFile!.buffer,
      req.driveFile!.mimetype,
      { name: req.driveFile!.sanitizedName }
    );
    
    res.json(result);
  }
);
```

## 🔧 Configuración Avanzada

### Tipos de Archivo Permitidos

El módulo incluye validaciones para estos tipos:

```typescript
const allowedTypes = {
  images: ['image/jpeg', 'image/png', 'image/gif', ...],
  videos: ['video/mp4', 'video/avi', ...],
  audio: ['audio/mp3', 'audio/wav', ...],
  documents: ['application/pdf', 'application/msword', ...],
  archives: ['application/zip', 'application/x-rar-compressed', ...],
  code: ['text/javascript', 'text/html', ...]
};
```

### Límites de Archivo

```typescript
const fileLimits = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFilesPerUpload: 10,
  allowedExtensions: ['.jpg', '.pdf', '.zip', ...]
};
```

### Personalizar Validaciones

```typescript
import { createFileTypeValidation } from './modules/drive';

// Solo permitir imágenes
const imageValidation = createFileTypeValidation([
  'image/jpeg', 
  'image/png', 
  'image/gif'
]);

router.post('/upload-image',
  uploadSingleFile,
  imageValidation,
  // ... resto del middleware
);
```

## 🛡️ Seguridad

### Validaciones Implementadas

- ✅ Tipos MIME permitidos
- ✅ Extensiones de archivo seguras
- ✅ Tamaños de archivo límite
- ✅ Sanitización de nombres de archivo
- ✅ Validación de IDs de Google Drive
- ✅ Control de cuotas de almacenamiento

### Sanitización

```typescript
import { sanitizeFileName, sanitizeDescription } from './modules/drive';

const safeName = sanitizeFileName("archivo<script>.pdf"); 
// Resultado: "archivo_script_.pdf"

const safeDesc = sanitizeDescription("<script>alert('xss')</script>Descripción");
// Resultado: "Descripción"
```

## 📊 Respuestas API

Todas las respuestas siguen el formato consistente del BaseController:

```typescript
// Respuesta exitosa
{
  "statusCode": 200,
  "url": "http://localhost:3000/api/drive/upload",
  "method": "POST",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789",
  "status": "success",
  "message": "Archivo subido exitosamente a Google Drive",
  "data": {
    "file": {
      "id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "name": "documento.pdf",
      "mimeType": "application/pdf",
      "size": "1048576",
      "webViewLink": "https://drive.google.com/file/d/...",
      "shareableLink": "https://drive.google.com/file/d/..."
    }
  }
}

// Respuesta de error
{
  "statusCode": 400,
  "status": "error",
  "message": "Archivo no válido",
  "errors": {
    "validation": ["Tipo de archivo no permitido: text/plain"]
  }
}
```

## 🔄 Middleware Disponible

### Para Subida de Archivos

```typescript
// Archivo único
handleSingleFileUpload = [
  validateDriveConfiguration,
  initializeDriveService,
  uploadSingleFile,
  handleMulterErrors,
  processSingleFile,
  checkUserQuota,
  logFileOperation('upload')
];

// Múltiples archivos
handleMultipleFileUpload = [
  validateDriveConfiguration,
  initializeDriveService,
  uploadMultipleFiles,
  handleMulterErrors,
  processMultipleFiles,
  checkUserQuota,
  logFileOperation('upload_multiple')
];
```

### Middleware Individual

```typescript
import { 
  validateDriveConfiguration,
  initializeDriveService,
  processSingleFile,
  checkUserQuota 
} from './modules/drive';

// Usar middleware específico según necesidades
router.post('/mi-ruta',
  validateDriveConfiguration,  // Valida config de Google Drive
  initializeDriveService,      // Inicializa DriveService
  processSingleFile,           // Procesa archivo subido
  checkUserQuota,              // Verifica límites de cuota
  miControlador
);
```

## 🐛 Manejo de Errores

### Errores Comunes

```typescript
// Error de configuración
{
  "message": "Google Drive no está configurado correctamente",
  "errors": {
    "missingVariables": ["GOOGLE_DRIVE_CLIENT_ID", "GOOGLE_DRIVE_CLIENT_SECRET"]
  }
}

// Error de archivo
{
  "message": "Archivo demasiado grande. Máximo permitido: 100MB"
}

// Error de cuota
{
  "message": "No hay suficiente espacio en Google Drive",
  "quotaInfo": {
    "used": "8.5 GB",
    "limit": "15.0 GB", 
    "available": "6.5 GB",
    "required": "2.5 MB"
  }
}
```

## 📝 Logging y Auditoría

El módulo incluye logging automático de todas las operaciones:

```typescript
// Logs automáticos
[DRIVE_UPLOAD] 2024-01-15T10:30:00.000Z - Usuario: 123 - archivo: documento.pdf (application/pdf, 1048576 bytes) - IP: 192.168.1.1

[USER_ACTIVITY] {"timestamp":"2024-01-15T10:30:00.000Z","userId":"123","action":"UPLOAD_FILE","resource":"DriveFile","details":{"fileId":"1Bx...","fileName":"documento.pdf"}}
```

## 🔗 Integración con Base de Datos

El módulo está diseñado para funcionar con el modelo `ContentFiles`:

```typescript
// Después de subir a Drive, guardar en BD
const uploadResult = await driveService.uploadFile(...);

if (uploadResult.success) {
  await ContentFiles.create({
    driveFileId: uploadResult.file.id,
    driveViewLink: uploadResult.file.webViewLink,
    driveDownloadLink: uploadResult.shareableLink,
    fileName: uploadResult.file.name,
    fileType: getFileTypeFromMime(uploadResult.file.mimeType),
    mimeType: uploadResult.file.mimeType,
    fileSize: parseInt(uploadResult.file.size),
    // ... otros campos
  });
}
```

## 🚀 Producción

### Consideraciones para Producción

1. **Rate Limiting**: Implementa rate limiting en las rutas de subida
2. **Autenticación**: Asegúrate de que las rutas estén protegidas
3. **Monitoreo**: Supervisa el uso de cuotas de Google Drive
4. **Backup**: Mantén backups de metadatos importantes
5. **Cache**: Considera cachear información de archivos frecuentemente accedidos

### Variables de Entorno de Producción

```env
NODE_ENV=production
GOOGLE_DRIVE_CLIENT_ID=production_client_id
GOOGLE_DRIVE_CLIENT_SECRET=production_client_secret
GOOGLE_DRIVE_REFRESH_TOKEN=production_refresh_token
GOOGLE_DRIVE_FOLDER_ID=production_folder_id
```

## 📞 Soporte y Contribuciones

Para reportar errores o solicitar características, por favor crea un issue en el repositorio del proyecto.

---

¿Necesitas ayuda adicional? Consulta la documentación de [Google Drive API](https://developers.google.com/drive/api/v3/about-sdk) para más detalles sobre las capacidades avanzadas.
