import { Router } from 'express';
import {
  createHeaderSection,
  getHeaderSections,
  getHeaderSectionById,
  updateHeaderSection,
  deleteHeaderSection,
} from '../headerSection/headerSectionController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/header-sections', getHeaderSections);
router.get('/header-sections/:id', getHeaderSectionById);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/header-sections', 
  authMiddleware,
  createHeaderSection
);

router.put('/header-sections/:id', 
  authMiddleware,
  updateHeaderSection
);

router.delete('/header-sections/:id', 
  authMiddleware,
  deleteHeaderSection
);

export default router;