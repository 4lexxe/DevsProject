import { Request } from "express";
import User from "../../user/User";

export interface TokenSession {
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
    roleId: number;
    authProvider: string;
    role?: {
      id: number;
      name: string;
      description: string;
    } | null;
  };
  sessions: TokenSession[];
}