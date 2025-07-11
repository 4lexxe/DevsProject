// routes/upload.routes.ts
import express from 'express';
import multer from 'multer';
import { uploadToImgBB } from '../services/imgBB.service';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint para subir archivos al backend (requiere autenticación)
router.post('/', 
  authMiddleware,
  permissionsMiddleware(['upload:resources']),
  upload.single('file'), 
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        return;
      }

      // Subir el archivo a imgBB
      const imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);

      // Devolver la URL pública
      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading file to imgBB:', error);
      res.status(500).json({ error: 'Error al subir el archivo' });
    }
  }
);

export default router;