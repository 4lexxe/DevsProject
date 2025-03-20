// controllers/upload.controller.ts
import { Request, Response } from 'express';
import { uploadToImgBB } from '../services/imgBB.service';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      return;
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Subir el archivo a imgBB
    const imageUrl = await uploadToImgBB(fileBuffer, fileName);

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};