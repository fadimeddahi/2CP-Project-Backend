const express = require('express');
const mongoose = require('mongoose');

const app = express();


require('dotenv').config();

  
// Middleware pour parser les requêtes JSON
app.use(express.json());

// Import des routes utilisateur
const userRoutes = require('./routes/userRoutes');

// Import des routes gym
const gymRoutes = require('./routes/gymRoutes');

// Import des routes produit
const productRoutes = require('./routes/productRoutes');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('🔥 MongoDB connecté avec succès!'))
  .catch(err => {
    console.error('\n⛔ ERREUR DE CONNEXION MONGODB:');
    console.error('Message:', err.message);
    console.error('Code:', err.codeName || err.code);
    console.error('Stack:', err.stack.split('\n')[0]);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });



// Montage des routes
app.use('/api/users', userRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/products', productRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    status: 'API fonctionnelle',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        // Ajoutez d'autres endpoints utilisateur ici
      },
      gyms: {
        create: 'POST /api/gyms',
        search: 'GET /api/gyms?ville=...',
        details: 'GET /api/gyms/:id',
      },
      products: {
        // Ajoutez ici les endpoints produits si besoin
        list: 'GET /api/products',
        details: 'GET /api/products/:id',
        create: 'POST /api/products',
      },
    },
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
});
