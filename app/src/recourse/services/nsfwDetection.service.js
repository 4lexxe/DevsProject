import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs';
class NSFWDetectionService {
    static model = null;
    static async loadModel() {
        try {
            this.model = await nsfwjs.load();
            console.log('Modelo NSFWJS cargado correctamente');
        }
        catch (error) {
            console.error('Error al cargar el modelo NSFWJS:', error);
            throw error;
        }
    }
    static async checkExplicitContent(url) {
        try {
            if (!this.model) {
                throw new Error('El modelo NSFWJS no está cargado.');
            }
            // Descargar la imagen desde la URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('No se pudo descargar la imagen.');
            }
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            // Convertir la imagen a un tensor
            const canvas = document.createElement('canvas');
            canvas.width = imageBitmap.width;
            canvas.height = imageBitmap.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('No se pudo crear el contexto del canvas.');
            }
            ctx.drawImage(imageBitmap, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const tensor = tf.browser.fromPixels(imageData);
            // Clasificar la imagen con el modelo NSFWJS
            const predictions = await this.model.classify(tensor);
            console.log('Predicciones:', predictions);
            // Verificar si hay contenido explícito
            const isExplicit = predictions.some((p) => (p.className === 'Porn' && p.probability > 0.75) ||
                (p.className === 'Hentai' && p.probability > 0.75) ||
                (p.className === 'Sexy' && p.probability > 0.75));
            return isExplicit;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error al analizar la URL:', errorMessage);
            throw error;
        }
    }
}
export default NSFWDetectionService;
