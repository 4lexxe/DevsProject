import React, { useState, useEffect } from 'react';
import { 
  getHeaderSections, 
  createHeaderSection, 
  updateHeaderSection, 
  deleteHeaderSection,
  type HeaderSection
} from '../services/headerSectionServices';
import HeaderSectionForm from './HeaderSectionForm';
import HeaderSectionList from './HeaderSectionList';
import HeaderSectionPreview from './HeaderSectionPreview';
import { useAuth } from '../../user/contexts';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';

const initialFormState: HeaderSection = {
  image: '',
  title: '',
  slogan: '',
  about: '',
  buttonName: '',
  buttonLink: '',
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
      setHeaderSections(data);
    } catch (err) {
      setError('Error al cargar las secciones de encabezado');
      console.error(err);
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

  const handleFormChange = (headerSection: HeaderSection) => {
    setCurrentHeaderSection(headerSection);
    setShowPreview(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      resetForm();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col space-y-6">
        {/* Encabezado con título y botón de acción */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Secciones de Encabezado</h1>
            <p className="text-gray-500 mt-1">Administra las secciones que aparecen en el carrusel principal</p>
          </div>
          
          {isMobile && (
            <button
              onClick={toggleForm}
              className={`mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
                showForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {showForm ? (
                'Cancelar'
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  {isEditing ? 'Editar sección' : 'Nueva sección'}
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-auto">
          {/* Formulario y vista previa */}
          {(showForm || !isMobile) && (
            <div className="flex flex-col space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {isEditing ? 'Editar Sección' : 'Crear Nueva Sección'}
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <HeaderSectionForm 
                    initialData={currentHeaderSection || initialFormState}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      resetForm();
                      if (isMobile) setShowForm(false);
                    }}
                    isEditing={isEditing}
                    loading={loading}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              
              {showPreview && currentHeaderSection && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-800">Vista Previa</h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    <HeaderSectionPreview headerSection={currentHeaderSection} />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Lista de secciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Secciones Existentes</h2>
              {loading && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
            </div>
            <div className="p-4 sm:p-6">
              <HeaderSectionList 
                headerSections={headerSections}
                onEdit={editHeaderSection}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSectionCRUD; 