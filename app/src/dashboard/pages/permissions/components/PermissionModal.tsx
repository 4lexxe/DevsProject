import React, { useState } from 'react';
import { PlusIcon, CheckIcon, XIcon, RefreshCw, Shield, LockIcon, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/profile/services/user.service';
import { RoleService, Role as RoleType } from '@/profile/services/role.service';
import { Permission } from '../types/permission.types';
import { toast } from 'react-hot-toast';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  username: string;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, userId, username }) => {
  const queryClient = useQueryClient();
  const [tabSelected, setTabSelected] = useState<'available' | 'blocked' | 'add'>('available');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consulta para obtener los permisos del usuario
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: () => userId ? UserService.getUserPermissions(userId) : null,
    enabled: !!userId && isOpen
  });
  
  // Consulta para obtener todos los permisos disponibles del sistema
  const { data: allPermissionsData, isLoading: isLoadingAllPermissions } = useQuery({
    queryKey: ['allPermissions'],
    queryFn: async () => {
      const response = await RoleService.getRolesWithPermissions();
      // Extraer todos los permisos únicos de los roles
      const uniquePermissions = new Map<number, Permission>();
      response.forEach((role: RoleType) => {
        role.Permissions?.forEach((permission: Permission) => {
          if (!uniquePermissions.has(permission.id)) {
            uniquePermissions.set(permission.id, permission);
          }
        });
      });
      return Array.from(uniquePermissions.values());
    },
    enabled: isOpen && tabSelected === 'add'
  });
  
  // Mutaciones para gestionar permisos
  const blockPermissionMutation = useMutation({
    mutationFn: (permissionId: number) => 
      UserService.blockPermission({ userId: userId!, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permiso bloqueado correctamente');
    }
  });
  
  const unblockPermissionMutation = useMutation({
    mutationFn: (permissionId: number) => 
      UserService.unblockPermission({ userId: userId!, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permiso desbloqueado correctamente');
    }
  });
  
  // Mutación para agregar permisos personalizados al usuario
  const addPermissionsMutation = useMutation({
    mutationFn: (permissionIds: number[]) => 
      UserService.addCustomPermissions({ userId: userId!, permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permisos personalizados agregados correctamente');
      setSelectedPermissionIds([]);
    },
    onError: (error) => {
      toast.error(`Error al agregar permisos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });
  
  // Filtrar los permisos que el usuario ya tiene para no mostrarlos en la lista de "agregar"
  const availablePermissionsToAdd = React.useMemo(() => {
    if (!allPermissionsData || !permissionsData) return [];
    
    // IDs de permisos que el usuario ya tiene
    const existingPermissionIds = new Set([
      ...(permissionsData.availablePermissions || []).map(p => p.id),
      ...(permissionsData.blockedPermissions || []).map(p => p.id)
    ]);
    
    // Filtrar los permisos que no están ya asignados
    return allPermissionsData.filter(permission => !existingPermissionIds.has(permission.id));
  }, [allPermissionsData, permissionsData]);

  // Filtrar permisos por término de búsqueda
  const filteredPermissionsToAdd = React.useMemo(() => {
    if (!searchTerm.trim()) return availablePermissionsToAdd;
    
    const term = searchTerm.toLowerCase();
    return availablePermissionsToAdd.filter(
      (permission) => 
        permission.name.toLowerCase().includes(term) || 
        (permission.description && permission.description.toLowerCase().includes(term))
    );
  }, [availablePermissionsToAdd, searchTerm]);
  
  // Manejadores para seleccionar/deseleccionar permisos
  const togglePermissionSelection = (permissionId: number) => {
    setSelectedPermissionIds(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  
  const handleAddPermissions = () => {
    if (selectedPermissionIds.length > 0) {
      addPermissionsMutation.mutate(selectedPermissionIds);
    } else {
      toast.error('Selecciona al menos un permiso para agregar');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-medium">Gestionar Permisos</h3>
            <p className="text-sm text-gray-500">Usuario: {username}</p>
            {permissionsData && (
              <p className="text-sm text-gray-500">Rol: {permissionsData.roleName}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${tabSelected === 'available' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
              onClick={() => setTabSelected('available')}
            >
              Permisos Disponibles
            </button>
            <button 
              className={`px-4 py-2 ${tabSelected === 'blocked' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
              onClick={() => setTabSelected('blocked')}
            >
              Permisos Bloqueados
            </button>
            <button 
              className={`px-4 py-2 ${tabSelected === 'add' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
              onClick={() => setTabSelected('add')}
            >
              Agregar Permisos
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-6">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : tabSelected === 'available' ? (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              <h4 className="font-medium text-gray-900">Permisos por Rol</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.availablePermissions
                  .filter(p => p.source === 'role')
                  .map((permission) => (
                    <div key={permission.id} className="flex flex-col p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1 mb-2">
                        <div className="font-medium truncate">{permission.name}</div>
                        <div className="text-xs text-gray-500 truncate">{permission.description}</div>
                        <div className="inline-flex items-center mt-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          <Shield className="h-3 w-3 mr-1" /> Rol
                        </div>
                      </div>
                      <div className="self-end">
                        <button 
                          onClick={() => blockPermissionMutation.mutate(permission.id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                          Bloquear
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
                
              <h4 className="font-medium text-gray-900 mt-6">Permisos Personalizados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.availablePermissions
                  .filter(p => p.source === 'custom')
                  .map(permission => (
                    <div key={permission.id} className="flex flex-col p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1 mb-2">
                        <div className="font-medium truncate">{permission.name}</div>
                        <div className="text-xs text-gray-500 truncate">{permission.description}</div>
                        <div className="inline-flex items-center mt-1 text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5">
                          <Shield className="h-3 w-3 mr-1" /> Personal
                        </div>
                      </div>
                      <div className="self-end">
                        <button 
                          onClick={() => blockPermissionMutation.mutate(permission.id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                          Bloquear
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
                
              {permissionsData?.availablePermissions.filter(p => p.source === 'custom').length === 0 && (
                <p className="text-center py-4 text-gray-500">
                  Este usuario no tiene permisos personalizados
                </p>
              )}
              
              {permissionsData?.availablePermissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Este usuario no tiene permisos disponibles
                </div>
              )}
            </div>
          ) : tabSelected === 'blocked' ? (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              <h4 className="font-medium text-gray-900">Permisos Bloqueados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.blockedPermissions?.map(permission => (
                  <div key={permission.id} className="flex flex-col p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 mb-2">
                      <div className="font-medium truncate">{permission.name}</div>
                      <div className="text-xs text-gray-500 truncate">{permission.description}</div>
                      <div className="inline-flex items-center mt-1 text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                        <LockIcon className="h-3 w-3 mr-1" /> Bloqueado
                      </div>
                    </div>
                    <div className="self-end">
                      <button 
                        onClick={() => unblockPermissionMutation.mutate(permission.id)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm hover:bg-green-200 transition-colors"
                      >
                        Desbloquear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {(permissionsData?.blockedPermissions?.length || 0) === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Este usuario no tiene permisos bloqueados
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Agregar Permisos Personalizados</h4>
                <button 
                  onClick={handleAddPermissions}
                  disabled={selectedPermissionIds.length === 0 || addPermissionsMutation.isPending}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    selectedPermissionIds.length === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addPermissionsMutation.isPending && <RefreshCw className="h-3 w-3 mr-2 animate-spin" />}
                  <PlusIcon className="h-3 w-3 mr-2" />
                  Agregar ({selectedPermissionIds.length})
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar permisos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {isLoadingAllPermissions ? (
                <div className="flex justify-center p-6">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700">Todos los permisos disponibles</h5>
                    <span className="text-xs text-gray-500">
                      {filteredPermissionsToAdd.length} de {availablePermissionsToAdd.length} permisos
                    </span>
                  </div>
                  
                  {filteredPermissionsToAdd.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredPermissionsToAdd.map((permission: Permission) => (
                        <div 
                          key={permission.id} 
                          className={`flex justify-between items-center p-3 border rounded-lg ${
                            selectedPermissionIds.includes(permission.id) 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'bg-gray-50'
                          } cursor-pointer hover:bg-gray-100 transition-colors`}
                          onClick={() => togglePermissionSelection(permission.id)}
                        >
                          <div className="flex-1 mr-2">
                            <div className="font-medium truncate">{permission.name}</div>
                            <div className="text-xs text-gray-500 truncate">{permission.description}</div>
                          </div>
                          <div className={`p-1 rounded-full flex-shrink-0 ${
                            selectedPermissionIds.includes(permission.id) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200'
                          }`}>
                            {selectedPermissionIds.includes(permission.id) ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <PlusIcon className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No se encontraron permisos con ese término de búsqueda' : 'No hay permisos adicionales disponibles para asignar'}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-6 border-t">
          <div className="text-sm text-gray-500">
            Total: {tabSelected === 'available' 
              ? permissionsData?.availablePermissions.length || 0 
              : tabSelected === 'blocked'
                ? permissionsData?.blockedPermissions.length || 0
                : filteredPermissionsToAdd.length || 0} permisos
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;