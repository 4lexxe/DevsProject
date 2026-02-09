import { MercadoPagoConfig } from 'mercadopago';

// Importar y validar todas las variables de entorno de MercadoPago
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;
export const MP_BACK_URL = process.env.MP_BACK_URL;
export const MP_PAYMENT_SUCCESS_URL = process.env.MP_PAYMENT_SUCCESS_URL;
export const MP_PAYMENT_FAILURE_URL = process.env.MP_PAYMENT_FAILURE_URL;
export const MP_PAYMENT_PENDING_URL = process.env.MP_PAYMENT_PENDING_URL;
export const MP_WEBHOOK_URL = process.env.MP_WEBHOOK_URL;

// Validar variables obligatorias
if (!MP_ACCESS_TOKEN) {
  throw new Error(' La variable de entorno MP_ACCESS_TOKEN no está definida');
}

if (!MP_PUBLIC_KEY) {
  throw new Error(' La variable de entorno MP_PUBLIC_KEY no está definida');
}

if (!MP_BACK_URL) {
  throw new Error(' La variable de entorno MP_BACK_URL no está definida');
}

// Validar URLs de pago
if (!MP_PAYMENT_SUCCESS_URL) {
  throw new Error(' La variable de entorno MP_PAYMENT_SUCCESS_URL no está definida');
}

if (!MP_PAYMENT_FAILURE_URL) {
  throw new Error(' La variable de entorno MP_PAYMENT_FAILURE_URL no está definida');
}

if (!MP_PAYMENT_PENDING_URL) {
  throw new Error(' La variable de entorno MP_PAYMENT_PENDING_URL no está definida');
}

if (!MP_WEBHOOK_URL) {
  throw new Error(' La variable de entorno MP_WEBHOOK_URL no está definida');
}

// Validar formato de URLs
const urlPattern = /^https?:\/\/.+/;

if (!urlPattern.test(MP_PAYMENT_SUCCESS_URL)) {
  throw new Error(' MP_PAYMENT_SUCCESS_URL debe ser una URL válida que comience con http:// o https://');
}

if (!urlPattern.test(MP_PAYMENT_FAILURE_URL)) {
  throw new Error(' MP_PAYMENT_FAILURE_URL debe ser una URL válida que comience con http:// o https://');
}

if (!urlPattern.test(MP_PAYMENT_PENDING_URL)) {
  throw new Error(' MP_PAYMENT_PENDING_URL debe ser una URL válida que comience con http:// o https://');
}

if (!urlPattern.test(MP_WEBHOOK_URL)) {
  throw new Error(' MP_WEBHOOK_URL debe ser una URL válida que comience con http:// o https://');
}

if (!urlPattern.test(MP_BACK_URL)) {
  throw new Error(' MP_BACK_URL debe ser una URL válida que comience con http:// o https://');
}

// Validar formato del Access Token
if (!MP_ACCESS_TOKEN.startsWith('APP_USR-')) {
  throw new Error(' MP_ACCESS_TOKEN debe tener el formato correcto (APP_USR-...)');
}

// Validar formato del Public Key
if (!MP_PUBLIC_KEY.startsWith('APP_USR-')) {
  throw new Error(' MP_PUBLIC_KEY debe tener el formato correcto (APP_USR-...)');
}

// Log de configuración exitosa
console.log(' Variables de entorno de MercadoPago validadas correctamente');
console.log(' Access Token:', MP_ACCESS_TOKEN.substring(0, 20) + '...');
console.log(' Public Key:', MP_PUBLIC_KEY.substring(0, 20) + '...');
console.log(' Payment URLs configuradas:');
console.log('  - Success:', MP_PAYMENT_SUCCESS_URL);
console.log('  - Failure:', MP_PAYMENT_FAILURE_URL);
console.log('  - Pending:', MP_PAYMENT_PENDING_URL);
console.log(' Webhook URL:', MP_WEBHOOK_URL);

// Configura el SDK con tu Access Token
export const MpConfig = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
});

