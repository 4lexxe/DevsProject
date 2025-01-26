export interface DiscordProfile {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
  locale: string;
  verified: boolean;
}

export interface DiscordUserResponse {
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
  providerMetadata: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    locale: string;
    verified: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}