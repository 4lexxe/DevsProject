// src/types/express.d.ts
import { User } from '../modules/user/User'; // Ajusta la ruta

declare module 'express' {
  interface Request {
    user?: User;
    geoLocation?: {
      city?: string;
      region?: string;
      country?: string;
      loc?: [number, number];
      timezone?: string;
      isProxy?: boolean;
    };
  }
}