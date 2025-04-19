/**
 * Utilidad simple para logging en el servidor
 */
export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }

  static error(message: string | Error, details?: any) {
    if (message instanceof Error) {
      console.error(`[ERROR] ${message.message}`);
      console.error(message.stack);
    } else {
      console.error(`[ERROR] ${message}`);
    }
    
    if (details) {
      console.error('[ERROR DETAILS]', details);
    }
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }
} 