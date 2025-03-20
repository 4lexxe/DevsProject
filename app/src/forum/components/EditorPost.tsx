import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ForumPostService, { ContentType, ForumPost } from '../services/forumPost.service';
import ForumCategoryService from '../services/forumCategory.service';
import ForumFlairService, { ForumFlair, FlairType } from '../services/forumFlair.service'; 
import { postSchema } from '../validators/postValidators';
import MDXEditorComponent from './MDXeditor'; 
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { GrSend } from "react-icons/gr";
import { BsExclamationCircle } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import FlairTag from './FlairTag';
import InputFile from './InputFile';

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface FormData {
  title: string;
  content: string;
  categoryId: number;
  flairId?: number;
  isNSFW: boolean;
  isSpoiler: boolean;
  linkUrl?: string;
  imageUrl?: string;
  contentType: ContentType;
}

interface PostData extends Partial<ForumPost> {
  flairId?: number;
}

const useContentTypeFromUrl = (): [ContentType, (type: ContentType) => void] => {
  const navigate = useNavigate();
  
  const parseContentType = (typeStr: string): ContentType => {
    const normalized = typeStr.toUpperCase();
    if (normalized === 'TEXT') return ContentType.TEXT;
    if (normalized === 'LINK') return ContentType.LINK;
    if (normalized === 'IMAGE') return ContentType.IMAGE;
    return ContentType.TEXT; 
  };
  
  const queryType = new URLSearchParams(window.location.search).get('type') || 'text';
  const [type, setTypeState] = useState<ContentType>(parseContentType(queryType));
  
  const setType = useCallback((newType: ContentType) => {
    console.log('Changing content type to:', newType);
    setTypeState(newType);
    navigate(`/forum/submit?type=${newType.toLowerCase()}`, { replace: true });
  }, [navigate]);
  
  return [type, setType];
};

const EditorPost: React.FC = () => {
  const navigate = useNavigate();
  
  const [contentType, setContentType] = useContentTypeFromUrl();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [flairs, setFlairs] = useState<ForumFlair[]>([]);
  
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
  
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allImageUrls, setAllImageUrls] = useState<string[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      categoryId: 0,
      isNSFW: false,
      isSpoiler: false,
      flairId: undefined,       
      contentType,
      ...(contentType === ContentType.LINK ? { linkUrl: '' } : {}),
      ...(contentType === ContentType.IMAGE ? { imageUrl: '' } : {})
    }
  });
  
  // Usar un tipo específico para los errores del formulario en lugar de any
  const formErrors = errors as Record<string, { message: string }>;
  
  const watchContent = watch('content');
  const watchLinkUrl = contentType === ContentType.LINK ? watch('linkUrl') : '';
  const watchCategoryId = watch('categoryId');
  
  // Inicialización del componente
  useEffect(() => {
    // 1. Cargar categorías
    const loadCategories = async () => {
      try {
        const categoriesResponse = await ForumCategoryService.getAllCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    
    // 2. Cargar flairs
    const loadFlairs = async () => {
      try {
        const flairsResponse = await ForumFlairService.getFlairsByType(FlairType.POST);
        setFlairs(flairsResponse);
      } catch (error) {
        console.error('Error al cargar flairs:', error);
      }
    };
    
    // 3. Inicializar el array de imágenes si hay una imagen inicial
    const currentImageUrl = watch('imageUrl');
    if (currentImageUrl && currentImageUrl.length > 0) {
      setAllImageUrls([currentImageUrl]);
    }
    
    // Ejecutar todo al montar el componente
    loadCategories();
    loadFlairs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencias vacías = solo al montar
  
  // Filtrado de categorías usando useMemo en lugar de useEffect + estado
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, categories]);
  
  // Efectos cuando cambia el tipo de contenido
  useEffect(() => {
    // 1. Incrementar la clave del editor para reiniciarlo
    if (contentType === ContentType.TEXT) {
      setEditorKey(prev => prev + 1);
    }
    
    // 2. Establecer contenido predeterminado si está vacío
    const defaultContent = contentType === ContentType.LINK
      ? '# Descripción del enlace\n\nExplica por qué este enlace es interesante...'
      : '# Título de tu publicación\n\nEscribe tu contenido aquí...';
    
    const currentContent = watch('content');
    if (!currentContent) {
      setValue('content', defaultContent);
    }
    
    // 3. Limpiar campos no relacionados con el tipo actual
    if (contentType !== ContentType.LINK) {
      setValue('linkUrl', '');
      setLinkPreview('');
    }
    
    if (contentType !== ContentType.IMAGE) {
      setValue('imageUrl', '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]); // Solo dependencia del tipo de contenido
  
  // Vista previa de enlaces
  useEffect(() => {
    if (contentType === ContentType.LINK && watchLinkUrl) {
      try {
        new URL(watchLinkUrl);
        setLinkPreview(watchLinkUrl);
      } catch {
        setLinkPreview('');
      }
    } else {
      setLinkPreview('');
    }
  }, [watchLinkUrl, contentType]);
  
  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
  };
  
  const handleCategorySelect = (category: Category) => {
    setValue('categoryId', category.id);
    setSearchTerm(category.name);
    setShowCategoryDropdown(false);
  };
  
  const onSubmit = async (data: FormData) => {
    console.log('Datos del formulario:', data);
    console.log('allImageUrls:', allImageUrls);
    
    setIsSubmitting(true);
    setGeneralError('');
    
    const postData: Partial<ForumPost> & { flairId?: number } = {
      title: data.title,
      content: data.content,
      categoryId: Number(data.categoryId),
      flairId: data.flairId,
      isNSFW: data.isNSFW,
      isSpoiler: data.isSpoiler,
      contentType
    };
    
    if (contentType === ContentType.LINK && data.linkUrl) {
      (postData as PostData & { linkUrl: string }).linkUrl = data.linkUrl;
    }
    
    if (contentType === ContentType.IMAGE) {
      if (!data.imageUrl && allImageUrls.length === 0) {
        setGeneralError('Por favor, sube o ingresa la URL de una imagen');
        setIsSubmitting(false);
        return;
      }
      
      (postData as PostData & { imageUrl: string[] }).imageUrl = allImageUrls.length > 0 
        ? allImageUrls 
        : (data.imageUrl ? [data.imageUrl] : []);
    }
    
    try {
      const newPost = await ForumPostService.createPost(postData);
      if (data.flairId) {
        await ForumFlairService.assignFlairToPost(newPost.id, data.flairId);
      }
      navigate(`/forum/posts/${newPost.id}`);
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      setGeneralError(err instanceof Error ? err.message : 'Ocurrió un error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const handleImageChange = (fileUrl: string | null) => {
    setValue('imageUrl', fileUrl || '');
    trigger('imageUrl');
    
    if (fileUrl === null) {
      setAllImageUrls([]);
    } 
    else if (fileUrl && !allImageUrls.includes(fileUrl)) {
      setAllImageUrls(prev => [...prev, fileUrl]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Crear nueva publicación</h1>
  
      {generalError && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200">
        <p className="text-red-700 flex items-center">
          <BsExclamationCircle className="w-5 h-5 mr-2" />
          {generalError}
        </p>
      </div>
      )}
  
      <div className="flex mb-6 border-b border-gray-200 space-x-2">
        {[ContentType.TEXT, ContentType.LINK, ContentType.IMAGE].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleContentTypeChange(type)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors
              ${
                contentType === type
                  ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            {type === ContentType.TEXT && 'Texto'}
            {type === ContentType.LINK && 'Enlace'}
            {type === ContentType.IMAGE && 'Imagen'}
          </button>
        ))}
      </div>
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título de la publicación
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${formErrors.title ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}`}
            placeholder="Escribe un título atractivo..."
          />
          {formErrors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <BsExclamationCircle className="w-4 h-4 mr-1" />
              {formErrors.title.message}
            </p>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <label htmlFor="categorySearch" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una categoría
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="categorySearch"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar una categoría..."
              autoComplete="off"
            />
          </div>
          
          {showCategoryDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
              <ul className="py-1">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isSelected = watchCategoryId === category.id;
                    return (
                      <li 
                        key={category.id}
                        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.icon && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden flex items-center justify-center">
                            {category.icon ? (
                              <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-semibold">{category.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                        )}
                        <div className="flex-grow">
                          <p className="font-medium text-gray-800">
                            {category.name}
                            {isSelected && <span className="ml-2 text-blue-600 text-sm">• Seleccionada</span>}
                          </p>
                          {category.description && (
                            <p className="text-sm text-gray-500 truncate">{category.description}</p>
                          )}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3 py-2 text-gray-500">No se encontraron comunidades</li>
                )}
              </ul>
            </div>
          )}
          
          <input type="hidden" {...register('categoryId', { valueAsNumber: true })} />
          
          {formErrors.categoryId && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <BsExclamationCircle className="w-4 h-4 mr-1" />
              {formErrors.categoryId.message}
            </p>
          )}
        </div>

        {contentType === ContentType.LINK && (
          <div>
            <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL del enlace
            </label>
            <div className="relative">
              <input
                type="url"
                id="linkUrl"
                {...register('linkUrl')}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${formErrors.linkUrl ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}`}
                placeholder="https://ejemplo.com"
              />
              {watchLinkUrl && (
                <div className="absolute right-3 top-2.5">
                  <a
                    href={watchLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <FaArrowUpRightFromSquare className="w-5 h-5 text-gray-400" />
                  </a>
                </div>
              )}
            </div>
            {formErrors.linkUrl && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <BsExclamationCircle className="w-4 h-4 mr-1" />
                {formErrors.linkUrl.message}
              </p>
            )}
            {linkPreview && (
              <div className="mt-2 p-3 border border-gray-200 rounded bg-gray-50">
                <p className="text-sm text-gray-500">
                  Vista previa:{" "}
                  <a href={linkPreview} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {linkPreview}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {contentType === ContentType.IMAGE && (
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Imagen
            </label>
            <InputFile
              value={watch('imageUrl') || null}
              onChange={handleImageChange}
              error={formErrors.imageUrl?.message}
              disabled={isSubmitting}
              allImages={allImageUrls} 
            />
          </div>
        )}

        {contentType === ContentType.TEXT && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenido detallado
            </label>
            <div className={`rounded-lg overflow-hidden border ${formErrors.content ? 'border-red-300' : 'border-gray-300'}`}>
              <MDXEditorComponent
                key={editorKey} 
                initialContent={watchContent || '# Título de tu publicación\n\nEscribe tu contenido aquí...'}
                onChange={(value) => setValue('content', value)}
                minHeight="300px"
                maxHeight="60vh"
                className="rounded-lg"
              />
            </div>
            {formErrors.content && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <BsExclamationCircle className="w-4 h-4 mr-1" />
                {formErrors.content.message}
              </p>
            )}
          </div>
        )}
        <div className="space-y-3">
        <FlairTag
  selectedFlairId={watch('flairId')}
  onFlairSelect={(flairId) => setValue('flairId', flairId ?? undefined)}
  isNSFW={watch('isNSFW')}
  onNSFWChange={(value) => setValue('isNSFW', value)}
  isSpoiler={watch('isSpoiler')}
  onSpoilerChange={(value) => setValue('isSpoiler', value)}
  flairs={flairs}
/>

        </div>
  
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/forum')}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <GrSend className="w-4 h-4 mr-2 animate-spin" />
                Publicando...
              </span>
            ) : (
              'Publicar ahora'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditorPost;