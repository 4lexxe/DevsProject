# Configuración de Fontello

## Pasos para usar iconos de Fontello:

1. **Visita Fontello**: Ve a https://fontello.com/

2. **Selecciona tus iconos**: 
   - Navega por las diferentes bibliotecas de iconos disponibles
   - Haz clic en los iconos que necesitas para seleccionarlos
   - Puedes buscar iconos específicos usando la barra de búsqueda

3. **Personaliza (opcional)**:
   - Cambia los nombres de los iconos si lo deseas
   - Ajusta los códigos Unicode si es necesario
   - Configura el prefijo CSS (por defecto es "icon-")

4. **Descarga el paquete**:
   - Haz clic en "Download webfont"
   - Se descargará un archivo ZIP

5. **Instala los archivos**:
   ```bash
   # Extrae el ZIP y copia los archivos a:
   app/public/fonts/fontello/
   ```
   
   La estructura debería ser:
   ```
   app/public/fonts/fontello/
   ├── css/
   │   └── fontello.css
   ├── font/
   │   ├── fontello.eot
   │   ├── fontello.svg
   │   ├── fontello.ttf
   │   └── fontello.woff
   └── config.json
   ```

6. **Importa el CSS en tu aplicación**:
   
   En `app/src/main.tsx` o `app/src/App.tsx`, agrega:
   ```typescript
   import '../public/fonts/fontello/css/fontello.css';
   ```

7. **Usa los iconos**:
   
   Usa el componente `FontelloIcon` que ya está creado:
   ```tsx
   import FontelloIcon from '@/shared/components/icons/FontelloIcon';
   
   // Ejemplo de uso
   <FontelloIcon name="icon-user" className="text-blue-500 text-2xl" />
   ```

## Alternativa: Usar react-icons (ya instalado)

Si prefieres una solución más rápida, puedes usar `react-icons` que ya está instalado:

```tsx
import { FaUser, FaShoppingCart, FaThumbsUp } from 'react-icons/fa';
import { IoPerson, IoCart, IoThumbsUp } from 'react-icons/io5';
import { MdPerson, MdShoppingCart, MdThumbUp } from 'react-icons/md';

// Uso
<FaUser className="w-4 h-4" />
```

## Iconos recomendados para las tarjetas de cursos:

- **Usuario/Estudiantes**: `icon-user`, `icon-users`, `icon-group`
- **Carrito de compras**: `icon-cart`, `icon-basket`, `icon-shopping-cart`
- **Me gusta/Rating**: `icon-thumbs-up`, `icon-heart`, `icon-star`
- **Tiempo/Duración**: `icon-clock`, `icon-time`, `icon-hourglass`
