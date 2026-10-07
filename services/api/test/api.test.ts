import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { sessionStore } from '../src/store/session-store.js';

describe('FIT3D Session & Privacy API Endpoints', () => {
  const app = createApp();

  afterAll(() => {
    sessionStore.stop();
  });

  it('GET /v1/health returns healthy operational status', async () => {
    const res = await request(app).get('/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.product).toBe('FIT3D Engine');
    expect(res.body.privacyAudit).toBe('STRICT_NO_PERSISTENT_DATA');
  });

  it('POST /v1/sessions creates a temporary session with TTL and privacy notice', async () => {
    const res = await request(app).post('/v1/sessions');
    expect(res.status).toBe(201);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.status).toBe('CREATED');
    expect(res.body.ttlSeconds).toBeGreaterThan(0);
    expect(res.body.privacyNotice).toContain('Your fitting data is temporary');
  });

  it('POST /v1/sessions/:id/body-input validates and stores temporary body metrics', async () => {
    const sessionRes = await request(app).post('/v1/sessions');
    const sessionId = sessionRes.body.sessionId;

    // Test rejection of invalid body inputs
    const invalidRes = await request(app)
      .post(`/v1/sessions/${sessionId}/body-input`)
      .send({ heightCm: 50, weightKg: 20 }); // below min limits
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.code).toBe('VALIDATION_ERROR');

    // Test valid body input
    const validRes = await request(app)
      .post(`/v1/sessions/${sessionId}/body-input`)
      .send({
        heightCm: 180,
        weightKg: 75,
        bodyShape: 'masculine',
        chestCm: 98,
        waistCm: 82,
      });
    expect(validRes.status).toBe(200);
    expect(validRes.body.status).toBe('UPLOADING');
    expect(validRes.body.measurementsReceived).toBe(true);
  });

  it('POST /v1/sessions/:id/garment accepts valid garment category', async () => {
    const sessionRes = await request(app).post('/v1/sessions');
    const sessionId = sessionRes.body.sessionId;

    // Invalid category rejection
    const invalidRes = await request(app)
      .post(`/v1/sessions/${sessionId}/garment`)
      .send({ category: 'shoes' });
    expect(invalidRes.status).toBe(400);

    // Valid T-shirt category
    const validRes = await request(app)
      .post(`/v1/sessions/${sessionId}/garment`)
      .send({ category: 'tshirt' });
    expect(validRes.status).toBe(200);
    expect(validRes.body.category).toBe('tshirt');
  });

  it('DELETE /v1/sessions/:id immediately wipes temporary data', async () => {
    const sessionRes = await request(app).post('/v1/sessions');
    const sessionId = sessionRes.body.sessionId;

    const delRes = await request(app).delete(`/v1/sessions/${sessionId}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.status).toBe('DESTROYED');
    expect(delRes.body.clearedAssets.sessionRecord).toBe(true);

    // Subsequent retrieval must return 404
    const getRes = await request(app).get(`/v1/sessions/${sessionId}/status`);
    expect(getRes.status).toBe(404);
  });
});
