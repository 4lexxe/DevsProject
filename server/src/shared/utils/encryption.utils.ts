import crypto from 'crypto';

/**
 * Utilidad para encriptar y desencriptar IDs de manera segura
 * Utiliza AES-256-GCM para encriptación simétrica
 */
export class EncryptionUtils {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly SECRET_KEY = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production';
  private static readonly IV_LENGTH = 16; // Para AES, esto es siempre 16
  private static readonly TAG_LENGTH = 16; // Para GCM, esto es siempre 16

  /**
   * Genera una clave de encriptación a partir del secreto
   */
  private static getKey(): Buffer {
    return crypto.scryptSync(this.SECRET_KEY, 'salt', 32);
  }

  /**
   * Encripta un ID numérico y retorna un string seguro
   * @param id - ID numérico a encriptar
   * @returns String encriptado en formato base64url
   */
  static encryptId(id: number | bigint): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
      cipher.setAAD(Buffer.from('course-id'));
      
      const idString = id.toString();
      let encrypted = cipher.update(idString, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combinar IV + authTag + encrypted data
      const combined = Buffer.concat([
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
      ]);
      
      // Retornar en formato base64url (URL-safe)
      return combined.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch (error) {
      console.error('Error encriptando ID:', error);
      throw new Error('Error al encriptar ID');
    }
  }

  /**
   * Desencripta un string y retorna el ID original
   * @param encryptedId - String encriptado
   * @returns ID numérico original
   */
  static decryptId(encryptedId: string): number {
    try {
      const key = this.getKey();
      
      // Convertir de base64url a base64 normal
      let base64 = encryptedId
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Agregar padding si es necesario
      while (base64.length % 4) {
        base64 += '=';
      }
      
      const combined = Buffer.from(base64, 'base64');
      
      // Extraer componentes
      const iv = combined.slice(0, this.IV_LENGTH);
      const authTag = combined.slice(this.IV_LENGTH, this.IV_LENGTH + this.TAG_LENGTH);
      const encrypted = combined.slice(this.IV_LENGTH + this.TAG_LENGTH);
      
      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      decipher.setAAD(Buffer.from('course-id'));
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      const id = parseInt(decrypted, 10);
      if (isNaN(id)) {
        throw new Error('ID desencriptado no es válido');
      }
      
      return id;
    } catch (error) {
      console.error('Error desencriptando ID:', error);
      throw new Error('ID encriptado inválido');
    }
  }

  /**
   * Valida si un string encriptado tiene el formato correcto
   * @param encryptedId - String a validar
   * @returns true si el formato es válido
   */
  static isValidEncryptedId(encryptedId: string): boolean {
    try {
      // Verificar que sea un string base64url válido
      const base64urlRegex = /^[A-Za-z0-9_-]+$/;
      if (!base64urlRegex.test(encryptedId)) {
        return false;
      }
      
      // Intentar desencriptar para validar
      this.decryptId(encryptedId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Encripta múltiples IDs
   * @param ids - Array de IDs a encriptar
   * @returns Array de IDs encriptados
   */
  static encryptIds(ids: (number | bigint)[]): string[] {
    return ids.map(id => this.encryptId(id));
  }

  /**
   * Desencripta múltiples IDs
   * @param encryptedIds - Array de IDs encriptados
   * @returns Array de IDs desencriptados
   */
  static decryptIds(encryptedIds: string[]): number[] {
    return encryptedIds.map(id => this.decryptId(id));
  }
}

/**
 * Middleware para manejar parámetros encriptados en rutas
 */
export const decryptParamMiddleware = (paramName: string) => {
  return (req: any, res: any, next: any) => {
    try {
      const encryptedId = req.params[paramName];
      if (encryptedId && EncryptionUtils.isValidEncryptedId(encryptedId)) {
        req.params[`${paramName}_decrypted`] = EncryptionUtils.decryptId(encryptedId);
        req.params[`${paramName}_original`] = req.params[paramName];
      }
      next();
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'ID inválido',
        details: 'El identificador proporcionado no es válido'
      });
    }
  };
};