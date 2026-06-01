'use strict';

require('dotenv').config({ path: '.env' });

const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;

// 🔥 DEBUG (solo desarrollo)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔥 REDIS_URL REAL =', REDIS_URL);
}

// ─────────────────────────────
// VALIDACIONES
// ─────────────────────────────
if (!REDIS_URL) {
  console.error('❌ REDIS_URL no está definida en .env');
  process.exit(1);
}

if (!/^rediss?:\/\//.test(REDIS_URL)) {
  console.error('❌ REDIS_URL inválida (debe iniciar con redis:// o rediss://)');
  process.exit(1);
}

if (
  REDIS_URL.includes('TU_TOKEN') ||
  REDIS_URL.includes('PENDIENTE') ||
  REDIS_URL.includes('example')
) {
  console.error('❌ REDIS_URL contiene valores de ejemplo');
  process.exit(1);
}

// ─────────────────────────────
// CONFIG UPSTASH OPTIMIZADO
// ─────────────────────────────
const redisConfig = {
  maxRetriesPerRequest: 1,

  retryStrategy(times) {
    if (times > 3) {
      console.error('❌ Redis no disponible (modo seguro activado)');
      return null; // 🚫 detiene reconexión infinita
    }

    return Math.min(times * 300, 2000);
  },

  // 🔥 IMPORTANTE PARA UPSTASH
  enableReadyCheck: false, // ❌ evita error NOPERM INFO
  lazyConnect: false
};

// ─────────────────────────────
// CONEXIONES
// ─────────────────────────────
const pub = new Redis(REDIS_URL, redisConfig);
const sub = new Redis(REDIS_URL, redisConfig);

// ─────────────────────────────
// EVENTOS
// ─────────────────────────────
pub.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✓ Redis PUB conectado');
  }
});

sub.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✓ Redis SUB conectado');
  }
});

// errores silenciosos en producción (opcional recomendado)
pub.on('error', (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('✗ Redis PUB error:', err.message);
  }
});

sub.on('error', (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('✗ Redis SUB error:', err.message);
  }
});

// ─────────────────────────────
// CIERRE LIMPIO
// ─────────────────────────────
process.on('SIGINT', async () => {
  try {
    await pub.quit();
    await sub.quit();
  } catch (e) {}

  process.exit(0);
});

module.exports = { pub, sub };