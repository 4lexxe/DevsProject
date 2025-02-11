import express, { Request, Response } from 'express';
import { createContent, getContentBySection, getContentById, updateContent, deleteContent } from '../content/contentController';

const router = express.Router();

/* // Ruta para crear contenido (requiere autenticación)
router.post('/content', createContent);

// Ruta para obtener el contenido de una sección (pública)
router.get('/content/section/:sectionId', getContentBySection);

// Ruta para obtener contenido por ID (pública)
router.get('/content/:id', getContentById);

// Ruta para actualizar contenido (requiere autenticación)
router.put('/content/:id', updateContent);

// Ruta para eliminar contenido (requiere autenticación)
router.delete('/content/:id', deleteContent); */

export default router;