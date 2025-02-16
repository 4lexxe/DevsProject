import React, { useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { ResourceService } from '../../services/resource.service';
import { resourceSchema, type ResourceFormData } from '../../validations/resourceValidation';
import NSFWDetectionService from '../../services/nsfwDetection.service';
import ResourceTypeSelector from '../../components/ResourceTypeSelector';
import ResourceUrlInput from '../../components/ResourceUrlInput';
import ResourceVisibilityToggle from '../../components/ResourceVisibilityToggle';
import InputFile from '../../components/InputFile';

const CreateResourceForm: React.FC = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      type: 'video',
      isVisible: true,
      coverImage: '',
    }
  });
  const [explicitContentWarning, setExplicitContentWarning] = React.useState<string>('');

  // Memorizar valores observados para prevenir renderizados innecesarios
  const type = watch('type');
  const title = watch('title');
  const description = watch('description');
  const url = watch('url');
  const coverImage = watch('coverImage');
  const isVisible = watch('isVisible');
  const titleLength = useMemo(() => title?.length || 0, [title]);
  const descriptionLength = useMemo(() => description?.length || 0, [description]);

  useEffect(() => {
    const initNSFW = async () => {
      await NSFWDetectionService.loadModel();
    };
    initNSFW();
  }, []);

  useEffect(() => {
    setExplicitContentWarning('');
  }, [type]);

  const handleCoverImageChange = useCallback(async (fileUrl: string | null) => {
    if (!fileUrl) {
      setValue('coverImage', '');
      setExplicitContentWarning('');
      return;
    }

    try {
      const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
      if (isExplicit) {
        throw new Error('La imagen de portada contiene contenido explícito.');
      }
      setValue('coverImage', fileUrl);
      setExplicitContentWarning('');
    } catch (error) {
      console.error('Error al verificar la imagen de portada:', error);
      toast.error('La imagen de portada contiene contenido inapropiado.');
      setExplicitContentWarning('¡Advertencia! La imagen de portada contiene contenido explícito.');
    }
  }, [setValue]);

  const onSubmit = useCallback(async (data: ResourceFormData) => {
    try {
      if (data.type === 'image' && data.url) {
        const isUrlExplicit = await NSFWDetectionService.checkExplicitContent(data.url);
        if (isUrlExplicit) {
          const warningMessage =
            ' ¿Estás seguro de querer subir eso? Nuestra plataforma implementa estrictas políticas de seguridad y filtros de contenido para prevenir la publicación de material inapropiado. No pongas en riesgo tu cuenta, podríamos suspenderla permanentemente >:(';
          setExplicitContentWarning(warningMessage);
          throw new Error('La URL contiene contenido explícito.');
        }
      }

      if (data.coverImage) {
        const isCoverImageExplicit = await NSFWDetectionService.checkExplicitContent(data.coverImage);
        if (isCoverImageExplicit) {
          const warningMessage = '¡Advertencia! La imagen de portada contiene contenido explícito. Por favor, selecciona una imagen adecuada.';
          setExplicitContentWarning(warningMessage);
          throw new Error('La imagen de portada contiene contenido explícito.');
        }
      }

      const userId = 1;
      const createdResource = await ResourceService.createResource({ ...data, userId });

      // Redirigir al recurso creado usando su ID
      const resourceId = createdResource.id; // Suponemos que el servicio devuelve el ID del recurso
      toast.success('Recurso creado correctamente');
      navigate(`/resources/${resourceId}`); // Redirigir al detalle del recurso
    } catch (error) {
      console.error('Error al crear el recurso:', error);
      toast.error('Error al crear el recurso. Por favor, intenta nuevamente.');
    }
  }, [navigate]);

  const handleReset = useCallback(() => {
    reset();
    setExplicitContentWarning('');
  }, [reset]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('type', e.target.value as 'video' | 'image');
  }, [setValue]);

  const handleUrlChange = useCallback(async (fileUrl: string | null) => {
    if (!fileUrl) {
      setValue('url', '');
      setExplicitContentWarning('');
      return;
    }

    try {
      const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
      if (isExplicit) {
        throw new Error('La imagen contiene contenido explícito.');
      }
      setValue('url', fileUrl);
      setExplicitContentWarning('');
    } catch (error) {
      console.error('Error al verificar la imagen:', error);
      toast.error('La imagen contiene contenido inapropiado.');
      setExplicitContentWarning(' ¡Advertencia! La imagen contiene contenido explícito.');
    }
  }, [setValue]);

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    setValue('isVisible', isVisible);
  }, [setValue]);

  const renderUrlInput = useMemo(() => {
    if (type === 'image') {
      return (
        <InputFile
          value={url}
          onChange={handleUrlChange}
          error={errors.url?.message}
        />
      );
    }
    return (
      <ResourceUrlInput 
        url={url}
        onChange={(e) => setValue('url', e.target.value)}
        error={errors.url?.message}
      />
    );
  }, [type, url, errors.url?.message, handleUrlChange, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Crear Nuevo Recurso</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6">
        {explicitContentWarning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">¡Advertencia!</strong>
            <span className="block sm:inline">{explicitContentWarning}</span>
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            maxLength={55}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {title && (
            <p className="text-xs text-gray-500 mt-1">{titleLength}/55</p>
          )}
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <ResourceTypeSelector 
          type={type} 
          onChange={handleTypeChange}
        />
        {renderUrlInput}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            {...register('description')}
            maxLength={500}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {description && (
            <p className="text-xs text-gray-500 mt-1">{descriptionLength}/500</p>
          )}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen de Portada
          </label>
          <InputFile
            value={coverImage}
            onChange={handleCoverImageChange}
            error={errors.coverImage?.message}
          />
        </div>
        <ResourceVisibilityToggle 
          isVisible={isVisible}
          onChange={handleVisibilityChange}
        />
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