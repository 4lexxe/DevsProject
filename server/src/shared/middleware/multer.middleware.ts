// middleware/multer.middleware.ts
import multer from 'multer';

const storage = multer.memoryStorage(); // Almacena el archivo en memoria como buffer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;