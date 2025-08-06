/**
 * Utilidades para manejo de errores de Google Drive
 */

/**
 * Explica el error 500 de Google Drive de manera comprensible
 */
export function explainDriveError500(): string {
  return `
🔍 INFORMACIÓN SOBRE ERROR 500 DE GOOGLE DRIVE:

Este es un problema conocido con la API de Google Drive donde:
- ✅ Los archivos SÍ se suben correctamente a Google Drive
- ❌ La API retorna un error 500 "Unknown Error" 
- ✅ Nuestro sistema detecta automáticamente esta situación
- ✅ Busca el archivo subido y continúa el proceso normalmente

RESULTADO: El archivo se procesa exitosamente a pesar del error inicial.

Este comportamiento es normal y no afecta la funcionalidad.
Los archivos están seguros en Google Drive y registrados en la base de datos.
`.trim();
}

/**
 * Muestra estadísticas de subida de archivos
 */
export function showUploadStats(successful: number, failed: number, total: number): string {
  const successRate = Math.round((successful / total) * 100);
  
  return `
📊 RESUMEN DE SUBIDA:
├── Total de archivos: ${total}
├── Subidos exitosamente: ${successful} (${successRate}%)
├── Con errores reales: ${failed}
└── Tasa de éxito: ${successRate}%

${successful === total ? '🎉 ¡Todos los archivos se procesaron correctamente!' : ''}
${failed > 0 ? '⚠️  Algunos archivos tuvieron errores reales y no se subieron.' : ''}
`.trim();
}

/**
 * Logs con formato mejorado para Google Drive
 */
export class DriveLogger {
  
  static uploadStart(fileName: string, size: number): void {
    console.log(`📤 [DRIVE] Subiendo: ${fileName} (${this.formatBytes(size)})`);
  }
  
  static uploadSuccess(fileName: string, driveId: string): void {
    console.log(`✅ [DRIVE] Éxito: ${fileName} -> ID: ${driveId}`);
  }
  
  static uploadError500Detected(fileName: string): void {
    console.log(`⚠️  [DRIVE] Error 500 detectado para: ${fileName} - Verificando subida...`);
  }
  
  static uploadError500Recovered(fileName: string, driveId: string): void {
    console.log(`🔄 [DRIVE] Recuperado: ${fileName} -> ID: ${driveId} (Error 500 era falsa alarma)`);
  }
  
  static uploadRealError(fileName: string, error: string): void {
    console.log(`❌ [DRIVE] Error real: ${fileName} - ${error}`);
  }
  
  static databaseSave(fileName: string, dbId: number, driveId: string): void {
    console.log(`💾 [DB] Guardado: ${fileName} -> BD: ${dbId} | Drive: ${driveId}`);
  }
  
  static processComplete(fileName: string, dbId: number): void {
    console.log(`🎉 [COMPLETE] ${fileName} -> BD ID: ${dbId}`);
  }
  
  static batchSummary(successful: number, failed: number, total: number): void {
    console.log('');
    console.log('═'.repeat(60));
    console.log(showUploadStats(successful, failed, total));
    console.log('═'.repeat(60));
    console.log('');
  }
  
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
