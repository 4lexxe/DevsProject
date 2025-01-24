import { Router } from 'express';
import {
  createHeaderSection,
  getHeaderSections,
  getHeaderSectionById,
  updateHeaderSection,
  deleteHeaderSection,
} from '../headerSection/headerSectionController';

const router = Router();

// Ruta para crear una nueva sección de encabezado
router.post('/header-sections', createHeaderSection);

// Ruta para obtener todas las secciones de encabezado
router.get('/header-sections', getHeaderSections);

// Ruta para obtener una sección de encabezado por ID
router.get('/header-sections/:id', getHeaderSectionById);

// Ruta para actualizar una sección de encabezado por ID
router.put('/header-sections/:id', updateHeaderSection);

// Ruta para eliminar una sección de encabezado por ID
router.delete('/header-sections/:id', deleteHeaderSection);

export default router;