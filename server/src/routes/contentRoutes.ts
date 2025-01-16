// routes/ContentRoutes.ts
import express, { Request, Response } from 'express';
import { createContent, getContentBySection, getContentById, updateContent, deleteContent } from '../controllers/contentController';

const router = express.Router();

// Ruta para crear contenido
router.post('/content', createContent);

// Ruta para obtener el contenido de una sección
router.get('/content/section/:sectionId', getContentBySection);

// Ruta para obtener contenido por ID
router.get('/content/:id', getContentById);

// Ruta para actualizar contenido
router.put('/content/:id', updateContent);

// Ruta para eliminar contenido
router.delete('/content/:id', deleteContent);

export default router;