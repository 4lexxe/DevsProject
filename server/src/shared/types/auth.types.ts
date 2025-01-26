export interface TokenSession {
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress: string;
  geoLocation: {
    city?: string;
    region?: string;
    country?: string;
    loc?: [number, number];
    timezone?: string;
    isProxy: boolean;
    org?: string;
  };
}