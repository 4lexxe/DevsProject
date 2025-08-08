/**
 * Script para verificar la configuración actual de MercadoPago
 * y ayudar en la migración entre sandbox y producción
 */

require('dotenv').config();

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;
const MP_BACK_URL = process.env.MP_BACK_URL;

function checkMercadoPagoConfig() {
  console.log('\n🔍 VERIFICACIÓN DE CONFIGURACIÓN DE MERCADOPAGO\n');
  console.log('=' .repeat(60));
  
  // Verificar Access Token
  if (!MP_ACCESS_TOKEN) {
    console.log('❌ MP_ACCESS_TOKEN no está configurado');
    return;
  }
  
  const isTestToken = MP_ACCESS_TOKEN.startsWith('TEST-');
  const isProdToken = MP_ACCESS_TOKEN.startsWith('APP_USR-');
  
  console.log(`📋 Access Token: ${MP_ACCESS_TOKEN.substring(0, 20)}...`);
  
  if (isTestToken) {
    console.log('🧪 MODO: SANDBOX (Pruebas)');
    console.log('   • Los pagos son simulados');
    console.log('   • Usar tarjetas de prueba de MercadoPago');
    console.log('   • No se procesan pagos reales');
  } else if (isProdToken) {
    console.log('🚀 MODO: PRODUCCIÓN');
    console.log('   • ⚠️  Los pagos son REALES');
    console.log('   • Se cobran comisiones');
    console.log('   • Usar tarjetas reales');
  } else {
    console.log('❌ Token no reconocido - Formato inválido');
    console.log('   • Debe comenzar con TEST- (sandbox) o APP_USR- (producción)');
  }
  
  // Verificar Public Key
  console.log('\n' + '-'.repeat(60));
  if (!MP_PUBLIC_KEY) {
    console.log('❌ MP_PUBLIC_KEY no está configurado');
  } else {
    console.log(`📋 Public Key: ${MP_PUBLIC_KEY.substring(0, 20)}...`);
    const isTestPubKey = MP_PUBLIC_KEY.startsWith('TEST-');
    const isProdPubKey = MP_PUBLIC_KEY.startsWith('APP_USR-');
    
    if (isTestToken && isTestPubKey) {
      console.log('✅ Public Key coincide con modo sandbox');
    } else if (isProdToken && isProdPubKey) {
      console.log('✅ Public Key coincide con modo producción');
    } else {
      console.log('⚠️  Public Key no coincide con el Access Token');
    }
  }
  
  // Verificar Back URL
  console.log('\n' + '-'.repeat(60));
  if (!MP_BACK_URL) {
    console.log('❌ MP_BACK_URL no está configurado');
  } else {
    console.log(`📋 Back URL: ${MP_BACK_URL}`);
    
    if (MP_BACK_URL.includes('localhost') || MP_BACK_URL.includes('devtunnels')) {
      console.log('🧪 URL de desarrollo detectada');
      if (isProdToken) {
        console.log('⚠️  Usando tokens de producción con URL de desarrollo');
      }
    } else if (MP_BACK_URL.startsWith('https://')) {
      console.log('🚀 URL de producción detectada');
      if (isTestToken) {
        console.log('⚠️  Usando tokens de sandbox con URL de producción');
      }
    } else {
      console.log('❌ URL debe usar HTTPS en producción');
    }
  }
  
  // Recomendaciones
  console.log('\n' + '='.repeat(60));
  console.log('📝 RECOMENDACIONES:');
  
  if (isTestToken) {
    console.log('\n🧪 MODO SANDBOX ACTIVO:');
    console.log('   • Perfecto para desarrollo y pruebas');
    console.log('   • Para producción, obtén credenciales reales en:');
    console.log('     https://www.mercadopago.com.ar/developers');
    console.log('   • Cambia los tokens que comiencen con APP_USR-');
  } else if (isProdToken) {
    console.log('\n🚀 MODO PRODUCCIÓN ACTIVO:');
    console.log('   • ⚠️  Los pagos procesados son REALES');
    console.log('   • Asegúrate de que la URL sea HTTPS');
    console.log('   • Verifica que los webhooks estén configurados');
    console.log('   • Monitorea los pagos en tu cuenta de MercadoPago');
  }
  
  console.log('\n📚 Para más información, consulta:');
  console.log('   CONFIGURACION_PRODUCCION_MERCADOPAGO.md');
  console.log('\n' + '='.repeat(60));
}

// Ejecutar verificación
checkMercadoPagoConfig();