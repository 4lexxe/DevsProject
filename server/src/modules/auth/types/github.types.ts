export interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string | undefined;
}

export interface GitHubUserResponse {
  name: string;
  email: string;
  avatar: string;
  username: string;
  displayName: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
    description: string;
  } | null;
  authProvider: string;
  authProviderId: string;
  providerMetadata: GitHubProfile | null;
  createdAt: Date;
  updatedAt: Date;
}