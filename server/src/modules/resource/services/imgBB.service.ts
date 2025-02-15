// services/imgbb.service.ts
import axios from 'axios';

const IMGBB_API_URL = process.env.IMGBB_API_URL;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export const uploadToImgBB = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('image', blob, fileName);

    const response = await axios.post(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.url; // Devuelve la URL pública de imgBB
    } else {
      throw new Error('Error al subir la imagen a imgBB');
    }
  } catch (error) {
    console.error('Error uploading to imgBB:', error);
    throw error;
  }
};