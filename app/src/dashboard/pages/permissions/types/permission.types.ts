
export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface UserPermission extends Permission {
  source: 'role' | 'custom';
}

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  roleId: number;
  isActiveSession: boolean;
  Role?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface RoleModel {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface RoleUpdateRequest {
  name: string;
  description: string;
  permissionIds: number[];
}