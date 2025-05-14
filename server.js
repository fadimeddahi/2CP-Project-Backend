const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();


require('dotenv').config();

  
// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import des routes utilisateur
const userRoutes = require('./routes/userRoutes');

// Montage des routes
app.use('/api/users', userRoutes);


// Import des routes
const gymRoutes = require('./routes/gymRoutes');

// Import des routes d'authentification
const authRoutes = require('./routes/authRoutes');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const postRoutes = require('./routes/postRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const newsRoutes = require('./routes/newsRoutes');



// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(' MongoDB connecté avec succès!'))
  .catch(err => {
    console.error('\n ERREUR DE CONNEXION MONGODB:');
    console.error('Message:', err.message);
    console.error('Code:', err.codeName || err.code);
    console.error('Stack:', err.stack.split('\n')[0]);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });



// Montage des routes
app.use('/api/gyms', gymRoutes);

// Montage des routes d'authentification
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/news', newsRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    status: 'API fonctionnelle',
    endpoints: {
      gyms: {
        create: 'POST /api/gyms',
        search: 'GET /api/gyms?ville=...',
        details: 'GET /api/gyms/:id',
      },
    },
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Serveur démarré sur http://localhost:${PORT}`);
});