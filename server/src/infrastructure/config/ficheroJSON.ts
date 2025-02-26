import * as fs from 'fs';
import * as path from 'path';

interface JsonData {
  records: any[];
}

export default class JsonFileHandler {
  // Ruta por defecto del archivo JSON
  private static readonly jsonFilePath: string = path.join(__dirname, 'data.json');

  // Inicializa el archivo JSON si no existe
  private static initializeFile(): void {
    if (!fs.existsSync(this.jsonFilePath)) {
      fs.writeFileSync(this.jsonFilePath, JSON.stringify({ records: [] }, null, 2));
    }
  }

  // Lee el archivo JSON y devuelve los datos
  private static readJsonFile(): JsonData {
    this.initializeFile(); // Asegura que el archivo exista
    const data = fs.readFileSync(this.jsonFilePath, 'utf-8');
    return JSON.parse(data);
  }

  // Escribe los datos en el archivo JSON
  private static writeJsonFile(data: JsonData): void {
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(data, null, 2));
  }

  // Inserta un nuevo registro en el archivo JSON
  public static insertRecord(newRecord: any): void {
    const jsonData = this.readJsonFile();
    jsonData.records.push(newRecord);
    this.writeJsonFile(jsonData);
  }

  // Obtiene todos los registros del archivo JSON
  public static getAllRecords(): any[] {
    const jsonData = this.readJsonFile();
    return jsonData.records;
  }

  // Busca un registro por un campo y valor específico
  public static findRecordByField(field: string, value: any): any | undefined {
    const jsonData = this.readJsonFile();
    return jsonData.records.find((record) => record[field] === value);
  }

  // Elimina un registro por un campo y valor específico
  public static deleteRecordByField(field: string, value: any): boolean {
    const jsonData = this.readJsonFile();
    const initialLength = jsonData.records.length;
    jsonData.records = jsonData.records.filter((record) => record[field] !== value);
    if (jsonData.records.length < initialLength) {
      this.writeJsonFile(jsonData);
      return true; // Registro eliminado
    }
    return false; // No se encontró el registro
  }
}