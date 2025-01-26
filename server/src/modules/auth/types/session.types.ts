export interface SessionResponse {
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface RevokeSessionResponse {
  message: string;
  remainingSessions: SessionResponse[];
}

export interface RevokeOtherSessionsResponse {
  message: string;
  currentSession: SessionResponse;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface RefreshTokenResponse {
  message: string;
  token: string;
  user: any;
  sessions: SessionResponse[];
}