import React, { useState, useEffect } from 'react';
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole,
  type Role,
  type RoleCreateRequest
} from '../services/roleService';
import RoleForm from './RoleForm';
import RoleList from './RoleList';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';

const RoleCRUD: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los roles';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentRole(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (role: Role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteRole(id);
      toast.success('Rol eliminado exitosamente');
      await fetchRoles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el rol';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (roleData: RoleCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing && currentRole?.id) {
        await updateRole(currentRole.id, roleData);
        toast.success('Rol actualizado exitosamente');
      } else {
        await createRole(roleData);
        toast.success('Rol creado exitosamente');
      }

      await fetchRoles();
      setShowForm(false);
      setCurrentRole(null);
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al guardar el rol';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentRole(null);
    setIsEditing(false);
    setError(null);
  };

  if (loading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <FontelloIcon
            name="icon-spin6"
            className="text-2xl text-gray-600 dark:text-gray-400 animate-spin"
            fallback={
              <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            }
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {roles.length} {roles.length === 1 ? 'rol' : 'roles'}
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontelloIcon
            name="icon-plus"
            className="text-base"
            fallback={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          Nuevo Rol
        </button>
      </div>

      {/* Mensaje de error - Estilo profesional */}
      {error && (
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FontelloIcon
                name="icon-attention"
                className="text-lg text-red-600 dark:text-red-400"
                fallback={
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Error al procesar la solicitud</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Layout: Formulario y Lista */}
      <div className={`grid gap-6 ${showForm && !isMobile ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Formulario */}
        {showForm && (
          <div className={isMobile ? 'order-2' : 'lg:order-1'}>
            <RoleForm
              initialData={currentRole}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={isEditing}
              loading={loading}
            />
          </div>
        )}

        {/* Lista */}
        <div className={isMobile ? 'order-1' : 'lg:order-2'}>
          <RoleList
            roles={roles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleCRUD;
