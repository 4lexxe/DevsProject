import { Router } from 'express';
import {
  createHeaderSection,
  getHeaderSections,
  getHeaderSectionById,
  updateHeaderSection,
  deleteHeaderSection,
} from '../headerSection/headerSectionController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/header-sections', getHeaderSections);
router.get('/header-sections/:id', getHeaderSectionById);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/header-sections', 
  authMiddleware,
  permissionsMiddleware(['manage:system_settings']),
  createHeaderSection
);

router.put('/header-sections/:id', 
  authMiddleware,
  permissionsMiddleware(['manage:system_settings']),
  updateHeaderSection
);

router.delete('/header-sections/:id', 
  authMiddleware,
  permissionsMiddleware(['manage:system_settings']),
  deleteHeaderSection
);

export default router;