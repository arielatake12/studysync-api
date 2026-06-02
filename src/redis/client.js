'use strict';

require('dotenv').config({ path: '.env' });

const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('❌ REDIS_URL no está definida en .env');
  process.exit(1);
}

const redisConfig = {
  maxRetriesPerRequest: 2,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 300, 2000);
  }
};

// ✔ UNA SOLA CONEXIÓN (ESTABLE)
const redis = new Redis(REDIS_URL, redisConfig);

// ─────────────────────────────
// LOGS
// ─────────────────────────────
redis.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✓ Redis conectado');
  }
});

redis.on('error', (err) => {
  console.error('✗ Redis error:', err.message);
});

// ─────────────────────────────
// JWT AUTH LAYER
// ─────────────────────────────
const redisAuth = redis;

// 🔥 BLACKLIST TOKEN
redisAuth.blacklistToken = async (token, ttl) => {
  return await redis.set(`bl:${token}`, "1", "EX", ttl);
};

// 🔍 verificar blacklist
redisAuth.isBlacklisted = async (token) => {
  return await redis.get(`bl:${token}`);
};

// 💾 refresh token
redisAuth.saveRefreshToken = async (userId, refreshToken, ttl) => {
  return await redis.set(`refresh:${userId}`, refreshToken, "EX", ttl);
};

// 🔍 get refresh token
redisAuth.getRefreshToken = async (userId) => {
  return await redis.get(`refresh:${userId}`);
};

// ❌ delete refresh token
redisAuth.deleteRefreshToken = async (userId) => {
  return await redis.del(`refresh:${userId}`);
};

module.exports = { redisAuth };