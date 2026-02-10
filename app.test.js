// app.test.js - Tests unitaires pour l'application
const request = require('supertest');
const { app, add, multiply } = require('./app');

// Tests pour les fonctions utilitaires
describe('Fonctions utilitaires', () => {
  test('add() doit additionner deux nombres correctement', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('multiply() doit multiplier deux nombres correctement', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
  });
});

// Tests pour les endpoints de l'API
describe('Endpoints de l\'API', () => {
  test('GET / doit retourner le message de bienvenue', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Bienvenue');
  });

  test('GET /health doit retourner le status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body).toHaveProperty('uptime');
  });

  test('GET /api/hello/:name doit retourner un message personnalisé', async () => {
    const response = await request(app).get('/api/hello/Jean');
    expect(response.statusCode).toBe(200);
    expect(response.body.greeting).toBe('Bonjour, Jean!');
  });
});

// Test pour simuler un échec (à décommenter pour tester l'échec du pipeline)
// describe('Test qui échoue (pour démonstration)', () => {
//   test('Ce test doit échouer intentionnellement', () => {
//     expect(1 + 1).toBe(3); // Ceci échouera et arrêtera le pipeline
//   });
// });
