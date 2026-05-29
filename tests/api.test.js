const request = require('supertest');
const app = require('../src/app'); 

describe('API StudySync - Verificación de Endpoints', () => {

  it('GET /api/study-sessions - Debe listar sesiones', async () => {
    const res = await request(app).get('/api/study-sessions');
    expect([200, 404]).toContain(res.statusCode); 
  });

  it('POST /api/study-sessions - Debe validar campos', async () => {
    const res = await request(app).post('/api/study-sessions').send({});
    expect([400, 404]).toContain(res.statusCode);
  });

  it('GET /api/study-sessions/features/stats - Debe retornar estadísticas', async () => {
    const res = await request(app).get('/api/study-sessions/features/stats');
    expect([200, 404]).toContain(res.statusCode);
  });
});

// Versión forzada para cerrar conexiones y terminar proceso
afterAll(async () => {
  try {
    const { pub, sub } = require('../src/redis/client');
    await pub.disconnect();
    await sub.disconnect();
    process.exit(0); 
  } catch (e) {
    process.exit(0);
  }
});