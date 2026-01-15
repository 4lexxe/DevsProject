import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Save,
  Shield,
  Key,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { RoleService } from '@/user/services/role.service';
import type { Permission, RoleFormData } from '@/user/interfaces/role.interface';
import { roleSchema } from '@/user/validations/role.validation';
import toast from 'react-hot-toast';
import { CustomInput, TextAreaInput } from '@/shared/components/inputs';

const RoleEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id && id !== 'new');

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Form con react-hook-form y zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
  });

  // Query para obtener el rol si estamos en modo edición
  const { data: role, isLoading: isLoadingRole } = useQuery({
    queryKey: ['role', id],
    queryFn: () => RoleService.getRoleById(Number(id)),
    enabled: isEditMode,
  });

  // Query para obtener todos los permisos disponibles
  const { data: allPermissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => RoleService.getAllPermissions(),
  });

  // Cargar datos del rol en el formulario
  useEffect(() => {
    if (role?.data && isEditMode) {
      setValue('name', role.data.name);
      setValue('description', role.data.description);
      
      // Cargar permisos del rol
      const permissionIds = role.data.Permissions?.map((p: Permission) => p.id) || [];
      setValue('permissionIds', permissionIds);
      setSelectedPermissions(permissionIds);
    }
  }, [role, isEditMode, setValue]);

  // Mutación para crear rol
  const createMutation = useMutation({
    mutationFn: (data: RoleFormData) =>
      RoleService.createRole({
        name: data.name,
        description: data.description,
        permissionIds: data.permissionIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rol creado exitosamente');
      navigate('/roles');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Error al crear el rol';
      toast.error(errorMessage);
      
      // Mostrar errores de validación si existen
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          const field = err.path || err.param || '';
          const message = err.msg || err.message || '';
          toast.error(`${field ? field + ': ' : ''}${message}`, {
            duration: 5000,
          });
        });
      }
    },
  });

  // Mutación para actualizar rol
  const updateMutation = useMutation({
    mutationFn: (data: RoleFormData) =>
      RoleService.updateRole(Number(id), {
        name: data.name,
        description: data.description,
        permissionIds: data.permissionIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      toast.success('Rol actualizado exitosamente');
      navigate('/roles');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Error al actualizar el rol';
      toast.error(errorMessage);
      
      // Mostrar errores de validación si existen
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          const field = err.path || err.param || '';
          const message = err.msg || err.message || '';
          toast.error(`${field ? field + ': ' : ''}${message}`, {
            duration: 5000,
          });
        });
      }
    },
  });

  // Handler del formulario
  const onSubmit = (data: RoleFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Handler para seleccionar/deseleccionar permisos
  const handlePermissionToggle = (permissionId: number) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId];

    setSelectedPermissions(newPermissions);
    setValue('permissionIds', newPermissions);
  };

  if (isLoadingRole && isEditMode) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-2 text-gray-600">Cargando rol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/roles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver a roles
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Modifica la información del rol y sus permisos'
                : 'Completa la información para crear un nuevo rol'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" />
            Información Básica
          </h2>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <CustomInput
                name="name"
                type="text"
                labelText="Nombre del Rol *"
                placeholder="ej: Administrador, Editor, Moderador"
                register={register}
                error={errors.name?.message}
              />
            </div>

            {/* Descripción */}
            <div>
              <TextAreaInput
                name="description"
                labelText="Descripción *"
                placeholder="Describe el propósito y alcance de este rol..."
                rows={4}
                register={register}
                error={errors.description?.message}
              />
            </div>
          </div>
        </div>

        {/* Permisos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary-600" />
              Permisos del Rol
            </h2>
            <span className="text-sm text-gray-600">
              {selectedPermissions.length} permisos seleccionados
            </span>
          </div>

          {isLoadingPermissions ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-primary-600"></div>
              <p className="mt-2 text-sm text-gray-600">Cargando permisos...</p>
            </div>
          ) : allPermissions.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    No hay permisos disponibles
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Los permisos deben ser configurados en el sistema antes de
                    asignarlos a roles. Por ahora, puedes crear el rol sin
                    permisos y agregarlos más tarde.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allPermissions.map((permission: Permission) => (
                <label
                  key={permission.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPermissions.includes(permission.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </p>
                      {selectedPermissions.includes(permission.id) && (
                        <CheckCircle className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                    {permission.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          {errors.permissionIds && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.permissionIds.message}
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/roles"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {(isSubmitting || createMutation.isPending || updateMutation.isPending) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {isEditMode ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditMode ? 'Actualizar Rol' : 'Crear Rol'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Información importante
            </p>
            <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
              <li>El nombre del rol debe ser único en el sistema</li>
              <li>Los permisos definen las acciones que pueden realizar los usuarios con este rol</li>
              <li>Puedes modificar los permisos en cualquier momento</li>
              {isEditMode && (
                <li>Los cambios afectarán a todos los usuarios con este rol asignado</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEditPage;
