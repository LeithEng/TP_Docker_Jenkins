// app.js - Exemple d'application Node.js simple
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur mon application DevOps!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Route pour tester l'API
app.get('/api/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ greeting: `Bonjour, ${name}!` });
});

// Fonction pour additionner deux nombres (pour les tests)
function add(a, b) {
  return a + b;
}

// Fonction pour multiplier deux nombres (pour les tests)
function multiply(a, b) {
  return a * b;
}

// Démarrage du serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
  });
}

// Export pour les tests
module.exports = { app, add, multiply };
