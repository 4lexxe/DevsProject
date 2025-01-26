import { Request, Response, NextFunction } from 'express';
import { GeoUtils } from '../../modules/auth/utils/geo.utils';
import geoip from 'geoip-lite';

// Definir la interfaz GeoLocation con todas las propiedades necesarias
interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  loc?: [number, number];
  timezone?: string;
  isProxy?: boolean;
  ip?: string;
  anonymizedIp?: string;
  rawIp?: string;
  org?: string;
}

// Extender la interfaz Request de Express correctamente
declare module 'express' {
  interface Request {
    geoLocation?: GeoLocation; // Asegurar que use la interfaz definida
  }
}

export const geoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let ip = GeoUtils.getValidIP(req);
    
    if (process.env.NODE_ENV === 'development' && ['127.0.0.1', '::1'].includes(ip)) {
      ip = '190.190.190.190';
    }

    const geoData = GeoUtils.getGeoData(ip);
    const anonymizedIp = GeoUtils.shouldAnonymize() ? GeoUtils.anonymizeIP(ip) : ip;

    // Asignar las propiedades correctamente usando la interfaz GeoLocation
    req.geoLocation = {
      ...geoData,
      ip: anonymizedIp,
      anonymizedIp: anonymizedIp,
      rawIp: GeoUtils.shouldAnonymize() ? undefined : ip
    };

    console.log('Geolocalización procesada:', {
      originalIp: ip,
      processedData: req.geoLocation
    });

  } catch (error) {
    console.error('Error en geolocalización:', error);
    req.geoLocation = GeoUtils.getDefaultGeoData();
  }
  
  next();
};