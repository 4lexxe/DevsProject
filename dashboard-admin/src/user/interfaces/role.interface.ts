export interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: number[];
  Permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  permissionIds?: number[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export interface RoleStats {
  totalRoles: number;
  totalPermissions: number;
  rolesWithPermissions: number;
}
