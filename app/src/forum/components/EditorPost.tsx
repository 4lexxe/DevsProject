import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ForumPostService, { ContentType, ForumPost } from '../services/forumPost.service';
import ForumCategoryService from '../services/forumCategory.service';
// Importar validaciones desde el archivo separado
import { postSchema, FormValues, ErrorRecord } from '../validators/postValidators';
// Importar el componente personalizado MDXEditor
import MDXEditorComponent from './MDXeditor';
// Importar iconos de Heroicons
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { GrSend } from "react-icons/gr";
import { BsExclamationCircle } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

const EditorPost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryType = new URLSearchParams(location.search).get('type') || 'TEXT';
  
  // Estado para el tipo de contenido seleccionado
  const [contentType, setContentType] = useState<ContentType>(
    (queryType as ContentType) || ContentType.TEXT
  );
  
  // Estado para las categorías disponibles
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  // Estado para la vista previa
  const [linkPreview, setLinkPreview] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Estado general para errores no relacionados con campos
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Configurar react-hook-form con el esquema de Zod
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      content: '# Título de tu publicación\n\nEscribe tu contenido aquí...',
      categoryId: categories.length > 0 ? categories[0].id : 0,
      isNSFW: false,
      isSpoiler: false,
      contentType: contentType as ContentType,
      ...(contentType === ContentType.LINK ? { linkUrl: '' } : {}),
      ...(contentType === ContentType.IMAGE ? { imageUrl: '' } : {})
    }
  });
  
  // Convertir errors a un tipo más específico para acceder a campos dinámicos
  const formErrors = errors as ErrorRecord;
  
  // Observar valores del formulario para las vistas previas
  const watchContent = watch('content');
  const watchLinkUrl = contentType === ContentType.LINK ? watch('linkUrl') : '';
  const watchImageUrl = contentType === ContentType.IMAGE ? watch('imageUrl') : '';
  const watchCategoryId = watch('categoryId');
  
  // Efecto para actualizar las vistas previas
  useEffect(() => {
    if (contentType === ContentType.LINK && watchLinkUrl) {
      try {
        // Validar si es una URL válida antes de mostrar la vista previa
        new URL(watchLinkUrl);
        setLinkPreview(watchLinkUrl);
      } catch {
        setLinkPreview('');
      }
    } else {
      setLinkPreview('');
    }
    
    if (contentType === ContentType.IMAGE && watchImageUrl) {
      try {
        new URL(watchImageUrl);
        setImagePreview(watchImageUrl);
      } catch {
        setImagePreview('');
      }
    } else {
      setImagePreview('');
    }
  }, [watchLinkUrl, watchImageUrl, contentType]);
  
  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await ForumCategoryService.getAllCategories();
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
        if (categoriesData.length > 0) {
          setValue('categoryId', categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setGeneralError('No se pudieron cargar las categorías. Por favor, inténtalo más tarde.');
      }
    };
    
    loadCategories();
  }, [setValue]);
  
  // Filtrar categorías cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);
  
  // Actualizar el tipo de contenido cuando cambia en la URL
  useEffect(() => {
    const newType = (new URLSearchParams(location.search).get('type') as ContentType) || ContentType.TEXT;
    setContentType(newType);
    
    // Resetear el formulario con valores predeterminados para el nuevo tipo
    const defaultContent = newType === ContentType.LINK
      ? '# Descripción del enlace\n\nExplica por qué este enlace es interesante...'
      : '# Título de tu publicación\n\nEscribe tu contenido aquí...';
    
    // Actualizar campos del formulario
    setValue('contentType', newType);
    setValue('content', defaultContent);
    
    if (newType === ContentType.LINK) {
      setValue('linkUrl', '');
    }
    
    if (newType === ContentType.IMAGE) {
      setValue('imageUrl', '');
    }
    
    // Limpiar vistas previas
    setLinkPreview('');
    setImagePreview('');
  }, [location.search, setValue]);
  
  // Cambiar el tipo de contenido y actualizar la URL
  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    navigate(`/forum/submit?type=${type}`);
  };
  
  // Seleccionar una categoría de la lista desplegable
  const handleCategorySelect = (category: Category) => {
    setValue('categoryId', category.id);
    setSearchTerm(category.name);
    setShowCategoryDropdown(false);
  };
  
  // Manejar el envío del formulario
  const onSubmit = async (data: FormValues) => {
    try {
      setGeneralError(null);
      
      const postData: Partial<ForumPost> = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        isNSFW: data.isNSFW,
        isSpoiler: data.isSpoiler,
        contentType: data.contentType
      };
      
      if (data.contentType === ContentType.LINK && 'linkUrl' in data) {
        postData.linkUrl = data.linkUrl;
      }
      
      if (data.contentType === ContentType.IMAGE && 'imageUrl' in data) {
        // Incorporar la imagen en el contenido markdown
        postData.content = `![${data.title}](${data.imageUrl})\n\n${data.content}`;
      }
      
      const newPost = await ForumPostService.createPost(postData, data.contentType);
      navigate(`/forum/posts/${newPost.id}`);
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      setGeneralError(err instanceof Error ? err.message : 'Ocurrió un error al crear la publicación');
    }
  };
  
  // Referencia al contenedor del dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efecto para manejar clics fuera del dropdown y cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    // Agregar el event listener cuando el dropdown esté visible
    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup: remover el event listener cuando el componente se desmonta o el dropdown se cierra
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

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

        {/* Buscador de categorías */}
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
          
          {/* Campo oculto para mantener el ID de la categoría seleccionada */}
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
              URL de la imagen
            </label>
            <input
              type="url"
              id="imageUrl"
              {...register('imageUrl')}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${formErrors.imageUrl ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}`}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formErrors.imageUrl && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <BsExclamationCircle className="w-4 h-4 mr-1" />
                {formErrors.imageUrl.message}
              </p>
            )}
            {imagePreview && (
              <div className="mt-2 p-3 border border-gray-200 rounded bg-gray-50">
                <img src={imagePreview} alt="Vista previa" className="max-h-64 max-w-full mx-auto" />
              </div>
            )}
          </div>
        )}
  
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido detallado
          </label>
          <div className={`rounded-lg overflow-hidden border ${formErrors.content ? 'border-red-300' : 'border-gray-300'}`}>
            <MDXEditorComponent
              initialContent={watchContent}
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
  
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="nsfw"
              {...register('isNSFW')}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="nsfw" className="ml-3 text-sm text-gray-700">
              NSFW (Contenido sensible)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="spoiler"
              {...register('isSpoiler')}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="spoiler" className="ml-3 text-sm text-gray-700">
              Contiene spoilers
            </label>
          </div>
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