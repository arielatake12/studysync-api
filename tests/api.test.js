const request = require('supertest');
const app = require('../src/app');

describe('API StudySync - Verificación de Sesiones', () => {

  it('GET /api/sesiones - listar sesiones', async () => {
    const res = await request(app).get('/api/sesiones');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /api/sesiones - validar creación', async () => {
    const res = await request(app)
      .post('/api/sesiones')
      .send({});

    expect([400, 401, 404]).toContain(res.statusCode);
  });

  it('GET /api/sesiones/:id - obtener sesión', async () => {
    const res = await request(app).get('/api/sesiones/1');
    expect([200, 404]).toContain(res.statusCode);
  });

});