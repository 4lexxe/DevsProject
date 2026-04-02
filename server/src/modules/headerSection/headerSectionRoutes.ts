import { Router } from 'express';
import {
  createHeaderSection,
  getHeaderSections,
  getHeaderSectionById,
  updateHeaderSection,
  deleteHeaderSection,
} from '../headerSection/headerSectionController';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

import { requirePermission } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/header-sections', getHeaderSections);
router.get('/header-sections/:id', getHeaderSectionById);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/header-sections',
  authMiddleware,
  requirePermission('header_section:create'),
  createHeaderSection
);

router.put('/header-sections/:id',
  authMiddleware,
  requirePermission('header_section:update'),
  updateHeaderSection
);

router.delete('/header-sections/:id',
  authMiddleware,
  requirePermission('header_section:delete'),
  deleteHeaderSection
);

export default router;