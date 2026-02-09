/**
 * Script para verificar la configuración de Discord OAuth
 * Ejecutar con: npx ts-node src/scripts/checkDiscordConfig.ts
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const discordCallbackUrl = process.env.DISCORD_CALLBACK_URL;

console.log('\n══════════════════════════════════════════════════');
console.log('   VERIFICACIÓN DE CONFIGURACIÓN DE DISCORD');
console.log('══════════════════════════════════════════════════\n');

// Verificar variables de entorno
console.log(' Variables de entorno:');
console.log(`   DISCORD_CLIENT_ID: ${discordClientId ? ' Definida' : ' No definida'}`);
if (discordClientId) {
  console.log(`      Valor: ${discordClientId.substring(0, 10)}... (${discordClientId.length} caracteres)`);
}

console.log(`   DISCORD_CLIENT_SECRET: ${discordClientSecret ? ' Definida' : ' No definida'}`);
if (discordClientSecret) {
  console.log(`      Valor: ${discordClientSecret.substring(0, 10)}... (${discordClientSecret.length} caracteres)`);
}

console.log(`   DISCORD_CALLBACK_URL: ${discordCallbackUrl ? ' Definida' : ' No definida'}`);
if (discordCallbackUrl) {
  console.log(`      Valor: ${discordCallbackUrl}`);
}

console.log('\n Verificaciones:');

// Verificar formato del Client ID (debe ser numérico)
if (discordClientId && !/^\d+$/.test(discordClientId)) {
  console.log('     DISCORD_CLIENT_ID no tiene el formato correcto (debe ser numérico)');
} else if (discordClientId) {
  // Verificar si el Client ID es válido para Discord (snowflake)
  const maxSnowflake = BigInt('9223372036854775807'); // Máximo valor de Int64
  const clientIdBigInt = BigInt(discordClientId);
  
  if (clientIdBigInt > maxSnowflake) {
    console.log('    DISCORD_CLIENT_ID es demasiado grande para un snowflake de Discord');
    console.log(`      Valor: ${discordClientId} (${discordClientId.length} dígitos)`);
    console.log(`      Máximo permitido: ${maxSnowflake.toString()} (19 dígitos)`);
    console.log('     Este número es inválido. Verifica que estés copiando el Client ID correcto.');
    console.log('    En Discord Developer Portal:');
    console.log('      - Ve a tu aplicación > OAuth2 > General');
    console.log('      - Copia el "Client ID" (no el Application ID si son diferentes)');
    console.log('      - El Client ID normalmente tiene 17-19 dígitos');
  } else {
    console.log('    DISCORD_CLIENT_ID tiene formato correcto y es válido');
    console.log(`      Longitud: ${discordClientId.length} dígitos`);
  }
}

// Verificar formato del Client Secret (debe tener al menos 32 caracteres)
if (discordClientSecret && discordClientSecret.length < 32) {
  console.log('     DISCORD_CLIENT_SECRET parece muy corto (normalmente tiene 32+ caracteres)');
} else if (discordClientSecret) {
  console.log('    DISCORD_CLIENT_SECRET tiene longitud adecuada');
}

// Verificar formato de la URL de callback
if (discordCallbackUrl) {
  try {
    const url = new URL(discordCallbackUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      console.log('     DISCORD_CALLBACK_URL debe usar http:// o https://');
    } else {
      console.log('    DISCORD_CALLBACK_URL tiene formato válido');
    }
  } catch (e) {
    console.log('    DISCORD_CALLBACK_URL no es una URL válida');
  }
}

console.log('\n Pasos para solucionar el error "invalid_client":');
console.log('   1. Ve a https://discord.com/developers/applications');
console.log('   2. Selecciona tu aplicación (o créala si no existe)');
console.log('   3. Ve a la sección "OAuth2"');
console.log('   4. Verifica que el Client ID coincida con DISCORD_CLIENT_ID');
console.log('   5. Si el Client Secret no coincide, haz clic en "Reset Secret" y actualiza DISCORD_CLIENT_SECRET');
console.log('   6. En "Redirects", asegúrate de que esté agregada esta URL exacta:');
if (discordCallbackUrl) {
  console.log(`      ${discordCallbackUrl}`);
} else {
  console.log('      (configura DISCORD_CALLBACK_URL primero)');
}
console.log('   7. Guarda los cambios en Discord');
console.log('   8. Reinicia el servidor');

console.log('\n Notas importantes:');
console.log('   - La URL de callback debe coincidir EXACTAMENTE (incluyendo http:// o https://)');
console.log('   - Si usas un túnel (como devtunnels), agrega también esa URL a los redirects');
console.log('   - El Client Secret es sensible: si lo regeneras, actualiza el .env');
console.log('   - Asegúrate de que la aplicación de Discord esté activa\n');
