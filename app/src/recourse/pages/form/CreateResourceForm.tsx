import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, PlusCircle, AlertCircle, FileText, Package, Image, Link2, AlignLeft, Eye, EyeOff, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResourceService } from '../../services/resource.service';
import { resourceSchema, type ResourceFormData } from '../../validations/resourceValidation';
import NSFWDetectionService from '../../services/nsfwDetection.service';
import ResourceTypeSelector from '../../components/ResourceTypeSelector';
import ResourceUrlInput from '../../components/ResourceUrlInput';
import ResourceVisibilityToggle from '../../components/ResourceVisibilityToggle';
import InputFile from '../../components/InputFile';
import { useAuth } from '@/user/contexts/AuthContext';

const ResourceForm: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const resourceId = id ? parseInt(id) : undefined;
  const isEditMode = !!resourceId;
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      type: 'video',
      isVisible: true,
      coverImage: '',
    },
    mode: 'onChange'
  });

  const [explicitContentWarning, setExplicitContentWarning] = React.useState<string>('');

  // Valores observados
  const type = watch('type');
  const title = watch('title');
  const description = watch('description');
  const url = watch('url');
  const coverImage = watch('coverImage');
  const isVisible = watch('isVisible');

  // Efecto para cargar recurso existente en modo edición
  // Verificar autenticación antes de cargar el formulario
  useEffect(() => {
    if (isLoading) return; // Esperar a que termine la verificación de autenticación

    if (!user) {
      toast.error('Debes iniciar sesión para acceder a esta página.');
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Cargar recurso existente en modo edición
  useEffect(() => {
    if (!isEditMode || !user) return;

    const loadResource = async () => {
      try {
        const resource = await ResourceService.getResourceById(resourceId);

        // Verificar si el usuario es el propietario
        if (resource.userId !== user.id) {
          toast.error('No tienes permisos para editar este recurso.');
          console.error('No tienes permisos para editar este recurso.');
          console.log('Recurso:', resource);
          console.log('Usuario:', user);
          navigate('/recursos', { replace: true });
          return;
        }

        // Cargar datos del recurso en el formulario
        reset({
          ...resource,
          coverImage: resource.coverImage || '',
          isVisible: resource.isVisible ?? true,
        });
      } catch (error) {
        console.error('Error al cargar recurso:', error);
        toast.error('Error al cargar el recurso.');
        navigate('/recursos', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [isEditMode, user, resourceId, reset, navigate]);

  // Cargar modelo NSFW
  useEffect(() => {
    const initNSFW = async () => {
      await NSFWDetectionService.loadModel();
    };
    initNSFW();
  }, []);

  // Resetear advertencias cuando cambia el tipo
  useEffect(() => {
    setExplicitContentWarning('');
  }, [type]);

  // Manejo de imagen de portada
  const handleCoverImageChange = useCallback(async (fileUrl: string | null) => {
    if (!fileUrl) {
      setValue('coverImage', '');
      setExplicitContentWarning('');
      return;
    }

    try {
      const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
      if (isExplicit) throw new Error('Contenido explícito detectado');
      setValue('coverImage', fileUrl, { shouldValidate: true });
      setExplicitContentWarning('');
    } catch (error) {
      console.error('Error en imagen de portada:', error);
      toast.error('Contenido inapropiado detectado');
      setExplicitContentWarning('¡Advertencia! Contenido explícito en la imagen de portada');
    }
  }, [setValue]);

  // Manejo de URL/imagen principal
  const handleUrlChange = useCallback(async (fileUrl: string | null) => {
    if (!fileUrl) {
      setValue('url', '');
      setExplicitContentWarning('');
      return;
    }

    try {
      if (type === 'image') {
        const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
        if (isExplicit) throw new Error('Contenido explícito detectado');
      }
      setValue('url', fileUrl, { shouldValidate: true });
      setExplicitContentWarning('');
    } catch (error) {
      console.error('Error en URL/imagen:', error);
      toast.error('Contenido inapropiado detectado');
      setExplicitContentWarning('¡Advertencia! Contenido explícito detectado');
    }
  }, [setValue, type]);

  // Envío del formulario
  const onSubmit = useCallback(async (data: ResourceFormData) => {
    try {
      // Validaciones NSFW
      if (type === 'image' && data.url) {
        const isUrlExplicit = await NSFWDetectionService.checkExplicitContent(data.url);
        if (isUrlExplicit) throw new Error('Contenido explícito en URL');
      }

      if (data.coverImage) {
        const isCoverExplicit = await NSFWDetectionService.checkExplicitContent(data.coverImage);
        if (isCoverExplicit) throw new Error('Contenido explícito en portada');
      }

      // Operación crear/actualizar
      if (isEditMode) {
        await ResourceService.updateResource(resourceId, data);
        toast.success('Recurso actualizado correctamente');
      } else {
        const userId = 1; // Obtener de autenticación en producción
        const createdResource = await ResourceService.createResource({ ...data, userId });
        navigate(`/resources/${createdResource.id}`);
        toast.success('Recurso creado correctamente');
        return;
      }

      navigate(`/resources/${resourceId}`);
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el recurso');
    }
  }, [isEditMode, resourceId, navigate, type]);

  // Resetear formulario
  const handleReset = useCallback(() => {
    reset();
    setExplicitContentWarning('');
  }, [reset]);

  // Componentes dinámicos
  const renderUrlInput = useMemo(() => {
    if (type === 'image') {
      return (
        <InputFile
          value={url}
          onChange={handleUrlChange}
          error={errors.url?.message}
          disabled={isEditMode} // Opcional: bloquear en edición si es necesario
        />
      );
    }
    return (
      <ResourceUrlInput 
        url={url}
        onChange={(e) => setValue('url', e.target.value, { shouldValidate: true })}
        error={errors.url?.message}
      />
    );
  }, [type, url, errors.url?.message, handleUrlChange, setValue, isEditMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Encabezado */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {isEditMode ? (
            <>
              <Edit className="w-5 h-5 text-blue-500" /> Editar Recurso
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-green-500" /> Crear Nuevo Recurso
            </>
          )}
        </h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Advertencia de contenido explícito */}
        {explicitContentWarning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>
              <strong className="font-bold">¡Advertencia!</strong>{' '}
              <span className="block sm:inline">{explicitContentWarning}</span>
            </span>
          </div>
        )}

        {/* Campo Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" /> Título *
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            maxLength={55}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isSubmitting}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.title.message}
              </p>
            ) : (
              <div />
            )}
            <span className="text-xs text-gray-500">{title?.length || 0}/55</span>
          </div>
        </div>

        {/* Selector de Tipo */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" /> Tipo de Recurso
          </label>
          <ResourceTypeSelector
            type={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setValue('type', e.target.value as 'video' | 'document' | 'image' | 'link', { shouldValidate: true })
            }
            disabled={isSubmitting || isEditMode}
          />
        </div>

        {/* Campo URL/Archivo */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            {type === 'image' ? (
              <>
                <Image className="w-5 h-5 text-gray-400" /> Subir Imagen
              </>
            ) : (
              <>
                <Link2 className="w-5 h-5 text-gray-400" /> URL del Recurso
              </>
            )}
          </label>
          {renderUrlInput}
        </div>

        {/* Campo Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-gray-400" /> Descripción
          </label>
          <textarea
            id="description"
            {...register('description')}
            maxLength={500}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isSubmitting}
            rows={4}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.description.message}
              </p>
            ) : (
              <div />
            )}
            <span className="text-xs text-gray-500">{description?.length || 0}/500</span>
          </div>
        </div>

        {/* Imagen de Portada */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Image className="w-5 h-5 text-gray-400" /> Imagen de Portada
          </label>
          <InputFile
            value={coverImage}
            onChange={handleCoverImageChange}
            error={errors.coverImage?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Visibilidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            {isVisible ? (
              <Eye className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}{' '}
            Visibilidad
          </label>
          <ResourceVisibilityToggle
            isVisible={isVisible}
            onChange={(value) => setValue('isVisible', value, { shouldValidate: true })}
            disabled={isSubmitting}
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
            <button
            type="button"
            onClick={() => {
              handleReset();
              navigate(-1);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
            disabled={isSubmitting}
            >
            <XCircle className="w-5 h-5 text-gray-500" /> Cancelar
            </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              isEditMode ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Actualizando...
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creando...
                </>
              )
            ) : isEditMode ? (
              <>
                <CheckCircle className="w-5 h-5" /> Actualizar Recurso
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Crear Recurso
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;