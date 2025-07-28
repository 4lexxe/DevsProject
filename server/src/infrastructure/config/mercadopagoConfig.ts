import { MercadoPagoConfig } from 'mercadopago';
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const MP_BACK_URL = process.env.MP_BACK_URL

if (!MP_ACCESS_TOKEN) {
  throw new Error('La variable de entorno MP_ACCESS_TOKEN no está definida');
}

if (!MP_BACK_URL) {
  throw new Error('La variable de entorno MP_BACK_URL no está definida');
}

// Configura el SDK con tu Access Token
export const MpConfig = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN, // Reemplaza con tu Access Token
});

