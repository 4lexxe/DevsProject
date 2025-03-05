import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { UserService } from '@/profile/services/user.service';
import { RoleService, Role as RoleType } from '@/profile/services/role.service';
import { User, RoleCreateRequest, RoleUpdateRequest } from '../types/permission.types';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import toast from 'react-hot-toast';

interface UserUpdateData {
  roleId?: number;
  isActiveSession?: boolean;
}

export const usePermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Consulta para obtener todos los usuarios
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await UserService.getUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }
  });

  // Asegurarse de que initialRoles siempre sea un array
  const initialRoles = useMemo(() => {
    const uniqueRoles = new Map<number, RoleType>();
    
    if (Array.isArray(users)) {
      users.forEach((user: User) => {
        if (user.Role && !uniqueRoles.has(user.Role.id)) {
          uniqueRoles.set(user.Role.id, user.Role as unknown as RoleType);
        }
      });
    }
    
    return Array.from(uniqueRoles.values());
  }, [users]);

  // Consulta para obtener todos los roles (ahora usando RoleService)
  const { 
    data: rolesData = [], 
    isLoading: isLoadingRoles,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        const response = await RoleService.getRoles();
        // Asegurarse de que la respuesta sea un array
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Error fetching roles:", error);
        // Usar los roles extraídos de los usuarios como fallback
        return initialRoles;
      }
    },
    initialData: initialRoles
  });

  // Asegurarse de que roles sea siempre un array
  const roles = useMemo(() => {
    if (Array.isArray(rolesData) && rolesData.length > 0) {
      return rolesData;
    }
    
    return initialRoles;
  }, [rolesData, initialRoles]);

  // Filtrar usuarios por rol y búsqueda
  const filteredUsers = useMemo(() => {
    return (users as User[])
      .filter((user: User) => 
        selectedRole === 'all' || (user.Role && user.Role.name === selectedRole)
      )
      .filter((user: User) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.username && user.username.toLowerCase().includes(query))
        );
      });
  }, [users, selectedRole, searchQuery]);

  // Mutación para actualizar el rol de un usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UserUpdateData }) => {
      return UserService.updateUser(id, data);
    },
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Error al actualizar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para crear un nuevo rol
  const createRoleMutation = useMutation({
    mutationFn: (roleData: RoleCreateRequest) => RoleService.createRole(roleData),
    onSuccess: () => {
      toast.success('Rol creado correctamente');
      refetchRoles();
      setRoleModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error al crear rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para actualizar un rol
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: RoleUpdateRequest }) => 
      RoleService.updateRole(id, data),
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
      refetchRoles();
      setRoleModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error al actualizar rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para eliminar un rol
  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => RoleService.deleteRole(id),
    onSuccess: () => {
      toast.success('Rol eliminado correctamente');
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error al eliminar rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Manejador para guardar un rol (crear o actualizar)
  const handleSaveRole = (roleData: RoleCreateRequest | RoleUpdateRequest) => {
    if (editingRole) {
      // Actualizar rol existente
      updateRoleMutation.mutate({ id: editingRole.id, data: roleData });
    } else {
      // Crear nuevo rol
      createRoleMutation.mutate(roleData as RoleCreateRequest);
    }
  };

  // Manejador para editar un rol
  const handleEditRole = (role: RoleType) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  // Manejador para crear un nuevo rol
  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleModalOpen(true);
  };

  // Manejador para eliminar un rol
  const handleDeleteRole = (roleId: number, roleName: string) => {
    // Verificar si es un rol del sistema
    if (SYSTEM_ROLES.includes(roleName.toLowerCase())) {
      toast.error('Los roles predefinidos del sistema no pueden ser eliminados');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.')) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  // Configuramos el efecto para la animación de carga
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Manejadores de eventos
  const handleRoleChange = (userId: number, roleId: number) => {
    updateUserMutation.mutate({
      id: userId,
      data: { roleId }
    });
  };

  const handleStatusChange = (userId: number, isActive: boolean) => {
    updateUserMutation.mutate({
      id: userId,
      data: { isActiveSession: isActive }
    });
  };

  const handleOpenPermissionModal = (userId: number, username: string) => {
    setSelectedUser(userId);
    setSelectedUsername(username);
    setPermissionModalOpen(true);
  };

  // Opciones de roles para el filtro
  const roleOptions = useMemo(() => {
    const options = [
      { value: 'all', label: 'Todos los Roles' }
    ];
    
    if (Array.isArray(roles)) {
      return [
        ...options,
        ...roles.map(role => ({
          value: role.name,
          label: role.name // Usar el nombre del rol en lugar de la descripción
        }))
      ];
    }
    
    return options;
  }, [roles]);

  return {
    // Estado
    users,
    roles,
    filteredUsers,
    selectedRole,
    setSelectedRole,
    selectedUser,
    selectedUsername,
    permissionModalOpen,
    setPermissionModalOpen,
    roleModalOpen,
    setRoleModalOpen,
    editingRole,
    searchQuery,
    setSearchQuery,
    isLoaded,
    
    // Carga
    isLoadingUsers,
    isLoadingRoles,
    isLoading: isLoadingUsers,
    
    // Manejadores
    handleRoleChange,
    handleStatusChange,
    handleOpenPermissionModal,
    handleSaveRole,
    handleEditRole,
    handleCreateRole,
    handleDeleteRole,
    
    // Opciones
    roleOptions
  };
};