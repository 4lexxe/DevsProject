const ENCRYPTION_KEY = 'your-secret-key-32-characters-long';

export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encodedData = btoa(encodeURIComponent(jsonString));
    return encodedData;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptData(encryptedData: string): any {
  try {
    const decodedData = decodeURIComponent(atob(encryptedData));
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}