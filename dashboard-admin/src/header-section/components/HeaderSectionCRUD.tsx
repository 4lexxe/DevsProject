import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getHeaderSections, 
  createHeaderSection, 
  updateHeaderSection, 
  deleteHeaderSection,
  type HeaderSection
} from '../services/headerSectionServices';
import HeaderSectionForm from './HeaderSectionForm';
import HeaderSectionList from './HeaderSectionList';
import HeroPreview from './HeroPreview';
import { useAuth } from '../../user/contexts';
import { Plus, AlertCircle, Loader2, Eye, X } from 'lucide-react';

const initialFormState: HeaderSection = {
  image: '',
  title: '',
  slogan: '',
  about: '',
  buttonName: '',
  buttonLink: '',
  badgeText: '',
  contentType: 'default',
  techStack: [],
};

const HeaderSectionCRUD: React.FC = () => {
  const { user } = useAuth();
  const [headerSections, setHeaderSections] = useState<HeaderSection[]>([]);
  const [currentHeaderSection, setCurrentHeaderSection] = useState<HeaderSection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowForm(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Inicializar
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchHeaderSections();
  }, []);

  const fetchHeaderSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHeaderSections();
      // Asegurar que siempre sea un array
      setHeaderSections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las secciones de encabezado');
      console.error(err);
      // Asegurar que siempre sea un array incluso en caso de error
      setHeaderSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (headerSection: HeaderSection) => {
    setLoading(true);
    setError(null);
    try {
      // Verificar que el usuario tenga un ID válido
      console.log('Usuario:', user);
      console.log('User ID:', user?.id);
      
      if (!user?.id) {
        throw new Error('ID de usuario no disponible');
      }

      const sectionWithAdminId = {
        ...headerSection,
      };
      
      console.log('Datos que se enviarán:', sectionWithAdminId);
      
      const response = await createHeaderSection(sectionWithAdminId);
      setHeaderSections([...headerSections, response.data]);
      resetForm();
      
      if (isMobile) {
        setShowForm(false);
      }
    } catch (err) {
      setError('Error al crear la sección de encabezado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, headerSection: HeaderSection) => {
    setLoading(true);
    setError(null);
    try {
      // Verificar que el usuario tenga un ID válido
      if (!user?.id) {
        throw new Error('ID de usuario no disponible');
      }

      const sectionWithAdminId = {
        ...headerSection,
      };
      
      const response = await updateHeaderSection(id, sectionWithAdminId);
      setHeaderSections(
        headerSections.map(section => 
          section.id === id ? response.data : section
        )
      );
      resetForm();
      
      if (isMobile) {
        setShowForm(false);
      }
    } catch (err) {
      setError('Error al actualizar la sección de encabezado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      setLoading(true);
      setError(null);
      try {
        await deleteHeaderSection(id);
        setHeaderSections(headerSections.filter(section => section.id !== id));
      } catch (err) {
        setError('Error al eliminar la sección de encabezado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const editHeaderSection = (headerSection: HeaderSection) => {
    setCurrentHeaderSection(headerSection);
    setIsEditing(true);
    setShowPreview(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setCurrentHeaderSection(null);
    setIsEditing(false);
    setShowPreview(false);
  };

  const handleSubmit = (headerSection: HeaderSection) => {
    if (isEditing && currentHeaderSection?.id) {
      handleUpdate(currentHeaderSection.id, headerSection);
    } else {
      handleCreate(headerSection);
    }
  };

  // Memoizar initialData para evitar recreaciones innecesarias
  // Debe estar en el nivel superior del componente, no dentro del JSX
  const memoizedInitialData = useMemo(() => {
    return currentHeaderSection || initialFormState;
  }, [currentHeaderSection?.id, currentHeaderSection?.title, currentHeaderSection?.slogan, currentHeaderSection?.image, currentHeaderSection?.about, currentHeaderSection?.buttonName, currentHeaderSection?.buttonLink, currentHeaderSection?.contentType]);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      resetForm();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header fijo estilo VS Code */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Editor de Header Sections</h1>
          {!isMobile && !showPreview && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                setShowPreview(false);
              }}
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sección
            </button>
          )}
          </div>
        <div className="flex items-center space-x-3">
          {showPreview && currentHeaderSection && (
            <button
              onClick={() => {
                setShowPreview(false);
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              title="Volver al editor"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar Vista
            </button>
          )}
          {!showPreview && currentHeaderSection && (
            <button
              onClick={() => {
                setShowPreview(true);
                setShowForm(false);
              }}
              className="flex items-center px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              title="Ver solo previsualización"
            >
              <Eye className="h-4 w-4 mr-2" />
              Previsualizar
            </button>
          )}
        </div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mx-8 mt-4 rounded-md shadow-sm">
            <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
            <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}
        
      {/* Contenido principal - Layout tipo VS Code */}
      {showPreview && currentHeaderSection ? (
        /* Vista única de previsualización */
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <HeroPreview headerSection={currentHeaderSection} />
        </div>
      ) : (
        /* Vista de editor dividida */
        <div className="flex-1 flex overflow-hidden">
          {/* Panel izquierdo - Editor/Formulario */}
          <div className={`${!showPreview && headerSections.length > 0 ? 'w-3/5' : 'w-full'} border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto transition-all duration-300`}>
            <div className="p-8">
              {showForm ? (
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {isEditing ? 'Editar Sección' : 'Crear Nueva Sección'}
                  </h2>
                    {isMobile && (
                      <button
                        onClick={toggleForm}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        ← Volver a la lista
                      </button>
                    )}
                </div>
                  <HeaderSectionForm 
                    initialData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      resetForm();
                      if (isMobile) setShowForm(false);
                    }}
                    isEditing={isEditing}
                    loading={loading}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
                    <Plus className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Selecciona una sección para editar</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">O crea una nueva sección de encabezado</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Sección
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Panel derecho - Lista de secciones */}
          {!showPreview && headerSections.length > 0 && (
            <div className="w-2/5 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Secciones Existentes</h2>
                  {loading && <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin" />}
            </div>
              <HeaderSectionList 
                headerSections={headerSections}
                onEdit={editHeaderSection}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSectionCRUD; 