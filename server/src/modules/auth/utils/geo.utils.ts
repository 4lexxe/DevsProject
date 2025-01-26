import axios from 'axios';
import { Request } from 'express';
import geoip from 'geoip-lite';

export interface GeoLocation {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: [number, number];
  timezone?: string;
  isProxy?: boolean;
  anonymizedIp?: string;
  rawIp?: string;
  org?: string;
}

export class GeoUtils {
  private static readonly IPINFO_TOKEN = process.env.IPINFO_TOKEN;

  // Método mejorado para limpiar IPs
  static cleanIp(ip: string): string {
    return ip.replace(/^::ffff:/, '').split(',')[0].trim();
  }

  // Método público para verificar estado del servicio
  static checkServiceStatus(): string {
    return this.IPINFO_TOKEN ? 'active' : 'inactive';
  }

  // Nueva implementación para obtener datos geográficos
  static async getGeoData(ip: string): Promise<GeoLocation> {
    try {
      // Primero intentar con geoip-lite
      const localGeo = this.getLocalGeoData(ip);
      if (localGeo.country !== 'XX') return localGeo;

      // Fallback a ipinfo.io si hay token
      if (this.IPINFO_TOKEN) {
        return await this.getIpInfoGeoData(ip);
      }
      
      return this.getDefaultGeoData(ip);
      
    } catch (error) {
      console.error('Error getting geo data:', error);
      return this.getDefaultGeoData(ip);
    }
  }

  // Método para obtener datos locales
  private static getLocalGeoData(ip: string): GeoLocation {
    const geo = geoip.lookup(ip) as geoip.Lookup | null;
    if (!geo) {
      return this.getDefaultGeoData(ip);
    }
    return {
      ip: ip,
      city: geo.city || 'Desconocido',
      region: geo.region || 'Desconocido',
      country: geo.country || 'XX',
      loc: geo.ll?.length === 2 ? geo.ll : [0, 0],
      timezone: geo.timezone || 'UTC',
      isProxy: false,
      anonymizedIp: this.anonymizeIP(ip)
    };
  }

  // Método para obtener datos de ipinfo.io
  private static async getIpInfoGeoData(ip: string): Promise<GeoLocation> {
    const response = await axios.get<{
      ip: string;
      city?: string;
      region?: string;
      country?: string;
      loc?: string;
      org?: string;
      timezone?: string;
    }>(`https://ipinfo.io/${ip}/json?token=${this.IPINFO_TOKEN}`);

    const loc = response.data.loc?.split(',').map(Number) as [number, number];

    return {
      ip: ip,
      city: response.data.city || 'Desconocido',
      region: response.data.region || 'Desconocido',
      country: response.data.country || 'XX',
      loc: loc || [0, 0],
      timezone: response.data.timezone || 'UTC',
      isProxy: this.checkIfProxy(response.data.org),
      anonymizedIp: this.anonymizeIP(ip),
      org: response.data.org || 'Desconocido'
    };
  }

  // Métodos públicos necesarios para el middleware
  static getValidIP(req: Request): string {
    const headersIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    const remoteIp = req.socket.remoteAddress || '127.0.0.1';
    return this.cleanIp(
      Array.isArray(headersIp) ? headersIp[0] : headersIp?.toString() || remoteIp
    );
  }

  static anonymizeIP(ip: string): string {
    return process.env.GEO_ANONYMIZE_IPS === 'true' 
      ? ip.split('.').slice(0, 2).concat(['xxx', 'xxx']).join('.')
      : ip;
  }

  static shouldAnonymize(): boolean {
    return process.env.GEO_ANONYMIZE_IPS === 'true';
  }

  static getDefaultGeoData(ip: string = '127.0.0.1'): GeoLocation {
    return {
      ip: ip,
      city: 'Desconocido',
      region: 'Desconocido',
      country: 'XX',
      loc: [0, 0],
      timezone: 'UTC',
      isProxy: false,
      anonymizedIp: this.anonymizeIP(ip)
    };
  }

  // Métodos existentes mejorados
  private static checkIfProxy(org?: string): boolean {
    if (!org) return false;
    const lowerOrg = org.toLowerCase();
    return lowerOrg.includes('proxy') || 
           lowerOrg.includes('vpn') || 
           lowerOrg.includes('tor') ||
           lowerOrg.includes('hosting');
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}