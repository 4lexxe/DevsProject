import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import * as nsfwjs from 'nsfwjs'; // Importa NSFWJS
import * as tf from '@tensorflow/tfjs'; // Importa TensorFlow.js
import { ResourceService } from '../../services/resource.service';
import { ResourceFormData, validateResource } from '../../validations/resourceValidation';

const CreateResourceForm: React.FC = () => {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    url: '',
    type: 'video',
    isVisible: true,
    coverImage: '',
  });
  const [errors, setErrors] = useState<Partial<ResourceFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [model, setModel] = useState<nsfwjs.NSFWJS | null>(null); // Modelo NSFWJS
  const [explicitContentWarning, setExplicitContentWarning] = useState<string>(''); // Mensaje de advertencia

  // Cargar el modelo NSFWJS al iniciar el componente
  React.useEffect(() => {
    const loadModel = async () => {
      try {
        const nsfwModel = await nsfwjs.load();
        setModel(nsfwModel);
        console.log('Modelo NSFWJS cargado correctamente');
      } catch (error) {
        console.error('Error al cargar el modelo NSFWJS:', error);
      }
    };
    loadModel();
  }, []);

  // Función para obtener el ícono correspondiente al tipo de recurso
  const getResourceIcon = (type: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case 'video':
        return <VideoIcon {...iconProps} />;
      case 'document':
        return <FileText {...iconProps} />;
      case 'image':
        return <ImageIcon {...iconProps} />;
      case 'link':
        return <LinkIcon {...iconProps} />;
      default:
        return null;
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Limpiar errores cuando el usuario comienza a escribir
    if (errors[name as keyof ResourceFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ResourceFormData];
        return newErrors;
      });
    }

    // Limpiar advertencias de contenido explícito
    if (explicitContentWarning) {
      setExplicitContentWarning('');
    }
  };

  // Función para verificar contenido explícito usando NSFWJS
  const checkExplicitContent = async (url: string): Promise<boolean> => {
    try {
      if (!model) {
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
      const predictions = await model.classify(tensor);
      console.log('Predicciones:', predictions);

      // Verificar si hay contenido explícito
      const isExplicit = predictions.some(
        (p: { className: string; probability: number }) =>
          p.className === 'Porn' && p.probability > 0.8
      );
      return isExplicit;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error al analizar la URL:', errorMessage);
      throw error;
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar los datos del formulario
    const validation = validateResource(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Verificar contenido explícito solo para imágenes y coverImage
      if (formData.type === 'image') {
        // Verificar si la URL contiene contenido explícito
        if (formData.url) {
          const isUrlExplicit = await checkExplicitContent(formData.url);
          if (isUrlExplicit) {
            const warningMessage =
              ' ¿Estás seguro de querer subir eso? Nuestra plataforma implementa estrictas políticas de seguridad y filtros de contenido para prevenir la publicación de material inapropiado. No pongas en riesgo tu cuenta, podríamos suspenderla permanentemente >:(';
            console.warn(warningMessage); // Imprime el mensaje en la consola
            setExplicitContentWarning(warningMessage); // Muestra el mensaje en el formulario
            throw new Error('La URL contiene contenido explícito.');
          }
        }
      }

      // Verificar si la imagen de portada contiene contenido explícito
      if (formData.coverImage) {
        const isCoverImageExplicit = await checkExplicitContent(formData.coverImage);
        if (isCoverImageExplicit) {
          const warningMessage =
            ' ¡Advertencia! La imagen de portada contiene contenido explícito. Por favor, selecciona una imagen adecuada.';
          console.warn(warningMessage); // Imprime el mensaje en la consola
          setExplicitContentWarning(warningMessage); // Muestra el mensaje en el formulario
          throw new Error('La imagen de portada contiene contenido explícito.');
        }
      }

      // Simular el ID del usuario autenticado (esto debería venir del contexto de autenticación)
      const userId = 1;

      // Crear el recurso usando el servicio
      await ResourceService.createResource({ ...formData, userId });

      // Mostrar notificación de éxito
      toast.success('Recurso creado correctamente');

      // Reiniciar el formulario
      setFormData({
        title: '',
        description: '',
        url: '',
        type: 'video',
        isVisible: true,
        coverImage: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating resource:', error);
      toast.error('Error al crear el recurso. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reiniciar el formulario
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      type: 'video',
      isVisible: true,
      coverImage: '',
    });
    setErrors({});
    setExplicitContentWarning('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Encabezado */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Crear Nuevo Recurso</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Advertencia de contenido explícito */}
        {explicitContentWarning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">¡Advertencia!</strong>
            <span className="block sm:inline">{explicitContentWarning}</span>
          </div>
        )}

        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={55}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formData.title && (
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/55</p>
          )}
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Tipo de recurso */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Recurso *
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center">
              {getResourceIcon(formData.type)}
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="video">Video</option>
                <option value="document">Documento</option>
                <option value="image">Imagen</option>
                <option value="link">Enlace</option>
              </select>
            </div>
          </div>
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formData.url && (
              <button
                type="button"
                onClick={() => window.open(formData.url, '_blank')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            )}
          </div>
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formData.description && (
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
          )}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Imagen de portada */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
            Imagen de Portada
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formData.coverImage && (
              <button
                type="button"
                onClick={() => window.open(formData.coverImage, '_blank')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            )}
          </div>
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
          )}
        </div>

        {/* Visibilidad */}
        <div>
          <label htmlFor="isVisible" className="block text-sm font-medium text-gray-700">
            Visibilidad del recurso
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }))
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              formData.isVisible ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">Visibilidad del recurso</span>
            <span
              className={`${
                formData.isVisible ? 'translate-x-5' : 'translate-x-0'
              } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out`}
            />
          </button>
          <span className="ml-3 text-sm text-gray-700">
            {formData.isVisible ? 'Visible' : 'No visible'}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creando...' : 'Crear Recurso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResourceForm;